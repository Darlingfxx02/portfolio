import { useRef, useState, type MouseEvent } from 'react'
import styles from './Profile.module.css'

/** Email link; click copies it and pops a "Скопировано" toast above the cursor. */
export function CopyEmail({ email }: { email: string }) {
  const [toast, setToast] = useState<{ x: number; y: number; k: number } | null>(null)
  const seq = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const onCopy = (e: MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX
    const y = e.clientY
    // Fire-and-forget — toast must not wait on (or be aborted by) the clipboard.
    navigator.clipboard?.writeText(email)?.catch(() => {})
    window.clearTimeout(timer.current)
    setToast({ x, y, k: ++seq.current })
    timer.current = window.setTimeout(() => setToast(null), 1500)
  }

  return (
    <>
      <button type="button" className={styles.link} data-sfx onClick={onCopy} title="Скопировать почту">
        {email}
      </button>
      {toast && (
        <span
          key={toast.k}
          className={styles.copyToast}
          style={{ left: toast.x, top: toast.y }}
          aria-hidden
        >
          Скопировано
        </span>
      )}
    </>
  )
}
