import styles from './HeaderTools.module.css'

/** Top-right text link to the CV route. */
export function HeaderTools({ onCv }: { onCv: boolean }) {
  return (
    <div className={styles.tools}>
      <a
        className={styles.cv}
        href="#cv"
        data-active={onCv}
        aria-current={onCv ? 'page' : undefined}
      >
        CV
      </a>
    </div>
  )
}
