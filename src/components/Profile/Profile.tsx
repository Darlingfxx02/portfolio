import styles from './Profile.module.css'

export function Profile() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.hero} aria-label="Portrait video">
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-video-poster.png"
          aria-label="Тимофей Ермолаев"
        >
          <source src="/hero-video.webm" type="video/webm" />
        </video>
        <div className={styles.videoGradients} aria-hidden />
      </div>

      <div className={styles.intro}>
        <div className={styles.identity}>
          <p className={styles.name}>Тимофей Ермолаев</p>
          <p className={styles.age}>24 y.o.</p>
        </div>
        <div className={styles.description}>
          <p>
            Помогаю бизнесам организовывать порядок в дизайне
            <br />
            и деливери в сложных ситуациях. Рисую кнопки и жгу
          </p>
          <p className={styles.tokenLine}>
            <span>токены</span>
            <span className={styles.aiIcons} aria-label="Codex and Claude">
              <img src="/stickers/codex-icon.webp" alt="Codex" />
              <img src="/stickers/claude-icon.webp" alt="Claude" />
            </span>
            <span>во благо человечества.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
