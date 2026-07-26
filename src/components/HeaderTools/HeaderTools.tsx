import styles from './HeaderTools.module.css'

const CV_URL = '/cv/Timothe_Ermolaev_Resume.pdf?v=20260726-3'

/** Top-right link that downloads the current CV. */
export function HeaderTools() {
  return (
    <div className={styles.tools}>
      <a
        className={styles.cv}
        href={CV_URL}
        download="Timothe_Ermolaev_Resume.pdf"
      >
        CV
      </a>
    </div>
  )
}
