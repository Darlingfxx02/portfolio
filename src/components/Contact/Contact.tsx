import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { socials } from '@/data/footer'
import { contact } from '@/data/contact'
import styles from './Contact.module.css'

/** #contact route — short warm intro, a mailto-composing form, and socials. */
export function Contact() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Grow the textarea to fit content past its default height (no resize grip).
  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
  useLayoutEffect(() => {
    if (taRef.current) autoGrow(taRef.current)
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const body = name.trim() ? `${message}\n\n— ${name.trim()}` : message
    const url =
      `mailto:${contact.mailto}` +
      `?subject=${encodeURIComponent(contact.subject)}` +
      `&body=${encodeURIComponent(body)}`
    window.location.href = url
  }

  return (
    <main className={styles.page}>
      <section className={styles.inner}>
        <ul className={styles.socials}>
          {socials.map((s) => {
            const external = s.href.startsWith('http')
            return (
              <li key={s.label}>
                <a
                  className={styles.social}
                  href={s.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {s.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className={styles.lead}>
          {contact.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <form id="contact-form" className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={contact.namePlaceholder}
            aria-label="Имя"
          />
          <textarea
            ref={taRef}
            className={styles.textarea}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              autoGrow(e.currentTarget)
            }}
            placeholder={contact.messagePlaceholder}
            rows={4}
            required
            aria-label="Сообщение"
          />
        </form>
      </section>
    </main>
  )
}
