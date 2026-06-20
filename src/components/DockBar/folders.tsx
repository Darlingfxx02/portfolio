import {
  House,
  ImagesSquare,
  ReadCvLogo,
  PaperPlaneTilt,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import { useId, type CSSProperties } from 'react'
import styles from './DockBar.module.css'

export type FolderBodyGradient = { from: string; to: string }

export type FolderSection = {
  label: string
  href: string
  Icon: PhIcon
  color: string
  bodyGradient?: FolderBodyGradient
  iconHoverColor?: string
  /** Download the href instead of navigating (CV). */
  download?: boolean
}

export const sections: FolderSection[] = [
  { label: 'Главная', href: '#top', Icon: House, color: '#3b82f6' },
  { label: 'Работы', href: '#works', Icon: ImagesSquare, color: '#3b82f6' },
  { label: 'CV', href: '#cv', Icon: ReadCvLogo, color: '#3b82f6' },
  { label: 'Контакты', href: '#contact', Icon: PaperPlaneTilt, color: '#3b82f6' },
]

const DEFAULT_GRADIENT: FolderBodyGradient = { from: '#b6dcf7', to: '#73b3e3' }

const folderPath = `
  M 18 0
  H 30
  C 44 0 46 18 60 18
  H 100
  C 110 18 118 26 118 36
  V 102
  C 118 112 110 120 100 120
  H 18
  C 8 120 0 112 0 102
  V 18
  C 0 8 8 0 18 0
  Z
`

export function MiniFolder({
  Icon,
  color,
  size = 64,
  bodyGradient,
  iconHoverColor,
}: {
  Icon: PhIcon
  color: string
  size?: number
  bodyGradient?: FolderBodyGradient
  iconHoverColor?: string
}) {
  const uid = useId()
  const clipId = `mfclip-${uid}`
  const gradId = `mfgrad-${uid}`
  const height = Math.round((size * 120) / 153)
  const g = bodyGradient ?? DEFAULT_GRADIENT
  return (
    <div className={styles.folder} style={{ width: size, height }}>
      <svg
        aria-hidden
        viewBox="0 0 118 120"
        preserveAspectRatio="none"
        className={styles.folderShape}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={folderPath} />
          </clipPath>
          <linearGradient
            id={gradId}
            x1="0"
            y1="0"
            x2="0"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={g.from} />
            <stop offset="1" stopColor={g.to} />
          </linearGradient>
        </defs>
        <rect
          x="14"
          y="10"
          width="92"
          height="50"
          rx="7"
          ry="7"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
        />
        <path d={folderPath} fill={`url(#${gradId})`} />
        <path
          d={folderPath}
          fill="none"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#${clipId})`}
        />
      </svg>
      <div
        className={styles.folderInner}
        style={
          {
            '--fm-icon-color': color,
            ...(iconHoverColor ? { '--fm-icon-hover-color': iconHoverColor } : null),
          } as CSSProperties
        }
      >
        <Icon size={Math.round(size * 0.42)} weight="fill" className={styles.folderIcon} />
      </div>
    </div>
  )
}
