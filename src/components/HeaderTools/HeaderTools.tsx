import styles from './HeaderTools.module.css'
import { useLang } from '@/lib/i18n'
import { cvDownloads } from '@/data/cvDownloads'

/** Top-right link that downloads the current CV. */
export function HeaderTools() {
  const { lang } = useLang()
  const download = cvDownloads[lang]
  return (
    <div className={styles.tools}>
      <a
        className={styles.cv}
        href={download.href}
        download={download.filename}
      >
        CV
      </a>
    </div>
  )
}
