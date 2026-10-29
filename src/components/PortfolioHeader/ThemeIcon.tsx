import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { Theme } from '@/lib/theme'
import styles from './ThemeToggle.module.css'

// Phosphor's 256px geometry, expressed as six matching cubic curves so the
// circle can become a crescent without swapping or crossfading SVG elements.
const shapes = {
  dark: 'M 111.736 74.414 C 86.174 82.172 69.651 106.905 72.270 133.490 C 74.889 160.074 95.920 181.108 122.504 183.730 C 149.088 186.351 173.823 169.831 181.584 144.270 C 185.532 131.267 184.618 117.273 179.011 104.895 C 173.405 92.517 163.488 82.599 151.111 76.991 C 138.733 71.383 124.739 70.467 111.736 74.414 Z',
  light: 'M 108.133 28.133 C 64.306 41.428 35.973 83.831 40.462 129.409 C 44.951 174.988 81.012 211.049 126.591 215.538 C 172.169 220.027 214.572 191.694 227.867 147.867 C 205.579 154.627 181.594 153.055 160.380 143.443 C 139.166 133.831 122.169 116.834 112.557 95.620 C 102.945 74.406 101.373 50.421 108.133 28.133 Z',
}

export function ThemeIcon({ theme }: { theme: Theme }) {
  const pathRef = useRef<SVGPathElement>(null)
  const previousTheme = useRef(theme)
  // React owns the initial shape; GSAP owns subsequent frames. Keeping this
  // prop stable prevents a render from snapping an interrupted morph to its end.
  const [initialTheme] = useState(theme)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changed = previousTheme.current !== theme
    previousTheme.current = theme
    let tween: gsap.core.Tween

    const update = () => {
      tween?.kill()
      tween = gsap.to(path, {
        attr: { d: shapes[theme] },
        duration: changed && !reducedMotion.matches ? 0.46 : 0,
        ease: 'power2.inOut',
      })
    }
    update()
    reducedMotion.addEventListener('change', update)
    return () => {
      tween.kill()
      reducedMotion.removeEventListener('change', update)
    }
  }, [theme])

  return (
    <svg className={styles.icon} data-theme={theme} width="24" height="24"
      viewBox="0 0 256 256" fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path ref={pathRef} d={shapes[initialTheme]} />
      <g className={styles.rays}>
        <path d="M128 16V40 M128 216V240 M16 128H40 M216 128H240 M48 48L64 64 M192 192L208 208 M48 208L64 192 M192 64L208 48" />
      </g>
    </svg>
  )
}
