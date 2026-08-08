package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func withStaticRoot(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "index.html"), []byte("index"), 0o600); err != nil {
		t.Fatal(err)
	}
	previous := staticRoot
	staticRoot = root
	t.Cleanup(func() { staticRoot = previous })
	return root
}

func TestStaticSecurityHeadersAndMethods(t *testing.T) {
	withStaticRoot(t)
	handler := securityHeaders(getOrHeadOnly(http.HandlerFunc(staticFile)))

	request := httptest.NewRequest(http.MethodGet, "/", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("GET status = %d", response.Code)
	}
	for _, header := range []string{
		"Content-Security-Policy",
		"Permissions-Policy",
		"Referrer-Policy",
		"Strict-Transport-Security",
		"X-Content-Type-Options",
		"X-Frame-Options",
	} {
		if response.Header().Get(header) == "" {
			t.Errorf("missing %s", header)
		}
	}

	request = httptest.NewRequest(http.MethodPost, "/", nil)
	response = httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusMethodNotAllowed {
		t.Fatalf("POST status = %d, want %d", response.Code, http.StatusMethodNotAllowed)
	}
	if response.Header().Get("Allow") != "GET, HEAD" {
		t.Fatalf("Allow = %q", response.Header().Get("Allow"))
	}
}

func TestStaticPathsCannotEscapeRoot(t *testing.T) {
	root := withStaticRoot(t)
	if err := os.WriteFile(filepath.Join(root, "asset.txt"), []byte("safe"), 0o600); err != nil {
		t.Fatal(err)
	}

	request := httptest.NewRequest(http.MethodGet, "/../../etc/passwd", nil)
	response := httptest.NewRecorder()
	staticFile(response, request)
	if response.Code == http.StatusOK {
		t.Fatalf("traversal returned status %d", response.Code)
	}
}

func TestProxyDoesNotForwardClientControlledHostHeaders(t *testing.T) {
	seen := make(chan *http.Request, 1)
	upstream := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		seen <- request.Clone(request.Context())
		response.WriteHeader(http.StatusNoContent)
	}))
	defer upstream.Close()

	request := httptest.NewRequest(http.MethodGet, "/proxy/example", nil)
	request.Host = "attacker.example"
	request.Header.Set("Forwarded", "host=attacker.example")
	request.Header.Set("X-Forwarded-Host", "attacker.example")
	request.Header.Set("X-Forwarded-Proto", "https")
	request.Header.Set("X-Real-IP", "203.0.113.10")
	response := httptest.NewRecorder()
	proxy(upstream.URL, "/proxy").ServeHTTP(response, request)

	got := <-seen
	if got.Host == "attacker.example" {
		t.Fatalf("untrusted host reached upstream: %q", got.Host)
	}
	for _, header := range []string{"Forwarded", "X-Forwarded-Host", "X-Forwarded-Proto", "X-Real-IP"} {
		if value := got.Header.Get(header); value != "" {
			t.Errorf("untrusted %s reached upstream: %q", header, value)
		}
	}
	if got.URL.Path != "/example" {
		t.Fatalf("upstream path = %q, want /example", got.URL.Path)
	}
}
