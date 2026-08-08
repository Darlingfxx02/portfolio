package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"mime"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"path"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

var staticRoot = env("STATIC_ROOT", "/app")

const defaultContentSecurityPolicy = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://www.youtube.com https://www.clarity.ms https://*.clarity.ms; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https://*.clarity.ms https://*.bing.com; frame-src https://www.youtube.com https://www.youtube-nocookie.com; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests"

func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func proxy(target, stripPrefix string) http.Handler {
	targetURL, err := url.Parse(target)
	if err != nil {
		log.Fatalf("invalid proxy target %q: %v", target, err)
	}

	reverseProxy := httputil.NewSingleHostReverseProxy(targetURL)
	originalDirector := reverseProxy.Director
	reverseProxy.Director = func(request *http.Request) {
		originalDirector(request)
		// Never let a client-controlled Host/forwarding header cross the trust
		// boundary. The upstream already knows its public URL from configuration.
		request.Host = targetURL.Host
		request.Header.Del("Forwarded")
		request.Header.Del("X-Forwarded-Host")
		request.Header.Del("X-Forwarded-Proto")
		request.Header.Del("X-Real-IP")
		if stripPrefix != "" {
			request.URL.Path = strings.TrimPrefix(request.URL.Path, stripPrefix)
			if request.URL.Path == "" {
				request.URL.Path = "/"
			}
		}
	}
	reverseProxy.ErrorHandler = func(response http.ResponseWriter, request *http.Request, err error) {
		log.Printf("proxy %s failed: %v", request.URL.Path, err)
		http.Error(response, "upstream unavailable", http.StatusBadGateway)
	}

	return reverseProxy
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Content-Security-Policy", env("CONTENT_SECURITY_POLICY", defaultContentSecurityPolicy))
		response.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		response.Header().Set("Cross-Origin-Resource-Policy", "same-origin")
		response.Header().Set("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()")
		response.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		response.Header().Set("Strict-Transport-Security", "max-age=31536000")
		response.Header().Set("X-Content-Type-Options", "nosniff")
		response.Header().Set("X-Frame-Options", "DENY")
		response.Header().Set("X-XSS-Protection", "0")
		next.ServeHTTP(response, request)
	})
}

func getOrHeadOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet && request.Method != http.MethodHead {
			response.Header().Set("Allow", "GET, HEAD")
			http.Error(response, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		next.ServeHTTP(response, request)
	})
}

func staticFile(response http.ResponseWriter, request *http.Request) {
	requestPath := path.Clean("/" + request.URL.Path)
	relativePath := strings.TrimPrefix(requestPath, "/")
	filePath := filepath.Join(staticRoot, filepath.FromSlash(relativePath))

	if info, err := os.Stat(filePath); err == nil && !info.IsDir() {
		if strings.HasPrefix(requestPath, "/assets/") {
			response.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			response.Header().Set("Cache-Control", "public, max-age=3600")
		}
		if contentType := mime.TypeByExtension(filepath.Ext(filePath)); contentType != "" {
			response.Header().Set("Content-Type", contentType)
		}
		http.ServeFile(response, request, filePath)
		return
	}

	if strings.HasPrefix(requestPath, "/assets/") {
		http.NotFound(response, request)
		return
	}

	response.Header().Set("Cache-Control", "no-cache")
	http.ServeFile(response, request, filepath.Join(staticRoot, "index.html"))
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/api/", proxy(env("ADMIN_UPSTREAM", "http://portfolio-admin-server:8787"), ""))
	mux.Handle("/directus/", proxy(env("DIRECTUS_UPSTREAM", "http://darling-live-directus-directus-1:8055"), "/directus"))
	mux.Handle("/healthz", getOrHeadOnly(http.HandlerFunc(func(response http.ResponseWriter, _ *http.Request) {
		response.Header().Set("Content-Type", "text/plain; charset=utf-8")
		response.WriteHeader(http.StatusOK)
		_, _ = response.Write([]byte("ok\n"))
	})))
	mux.Handle("/", securityHeaders(getOrHeadOnly(http.HandlerFunc(staticFile))))

	server := &http.Server{
		Addr:              ":" + env("PORT", "3000"),
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
		MaxHeaderBytes:    1 << 20,
		IdleTimeout:       60 * time.Second,
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("portfolio server listening on %s", server.Addr)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server failed: %v", err)
		}
	}()

	<-stop
	shutdownContext, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownContext); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}

	fmt.Println("portfolio server stopped")
}
