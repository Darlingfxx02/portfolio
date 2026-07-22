import { type Icon as PhIcon } from '@phosphor-icons/react'
import { useId, type CSSProperties, type ReactNode } from 'react'
import type { FolderBodyGradient } from './folderData'
import styles from './DockBar.module.css'

const DEFAULT_GRADIENT: FolderBodyGradient = { from: '#b6dcf7', to: '#73b3e3' }
const FOLDER_VIEWBOX_WIDTH = 124
const FOLDER_VIEWBOX_HEIGHT = 96.44444274902344

const folderPath = `
  M 18.91525423728814 0
  L 31.52542372881356 0
  C 46.237288135593225 0 48.33898305084746 14.466666412353517 63.05084745762712 14.466666412353517
  L 105.08474576271188 14.466666412353517
  C 115.59322033898306 14.466666412353517 124.00000000000001 20.89629592895508 124.00000000000001 28.933332824707033
  L 124.00000000000001 81.97777633666992
  C 124.00000000000001 90.01481323242187 115.59322033898306 96.44444274902344 105.08474576271188 96.44444274902344
  L 18.91525423728814 96.44444274902344
  C 8.406779661016952 96.44444274902344 0 90.01481323242187 0 81.97777633666992
  L 0 14.466666412353517
  C 0 6.429629516601564 8.406779661016952 0 18.91525423728814 0
  Z
`

const folderTabPath = `
  M 7.355929084446118 0
  L 89.32199602541715 0
  C 93.38456349275195 0 96.67792510986327 2.5188120616995366 96.67792510986327 5.625924224853516
  L 96.67792510986327 34.559248809814456
  C 96.67792510986327 37.666360972968434 93.38456349275195 40.18517303466797 89.32199602541715 40.18517303466797
  L 7.355929084446118 40.18517303466797
  C 3.2933616171113176 40.18517303466797 0 37.666360972968434 0 34.559248809814456
  L 0 5.625924224853516
  C 0 2.5188120616995366 3.2933616171113176 0 7.355929084446118 0
  Z
`

export function MiniFolder({
  Icon,
  color = '#3b82f6',
  size = 64,
  bodyGradient,
  iconHoverColor,
  tabFill = '#ffffff',
  tabStroke = 'rgba(0,0,0,0.12)',
  outlineStroke = 'rgba(0,0,0,0.18)',
  children,
  className,
  contentClassName,
}: {
  Icon?: PhIcon
  color?: string
  size?: number
  bodyGradient?: FolderBodyGradient
  iconHoverColor?: string
  tabFill?: string
  tabStroke?: string
  outlineStroke?: string
  children?: ReactNode
  className?: string
  contentClassName?: string
}) {
  const uid = useId()
  const clipId = `mfclip-${uid}`
  const gradId = `mfgrad-${uid}`
  const height = (size * FOLDER_VIEWBOX_HEIGHT) / FOLDER_VIEWBOX_WIDTH
  const g = bodyGradient ?? DEFAULT_GRADIENT
  return (
    <div
      className={`${styles.folder}${className ? ` ${className}` : ''}`}
      style={{ width: size, height }}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${FOLDER_VIEWBOX_WIDTH} ${FOLDER_VIEWBOX_HEIGHT}`}
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
            y2={FOLDER_VIEWBOX_HEIGHT}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={g.from} />
            <stop offset="1" stopColor={g.to} />
          </linearGradient>
        </defs>
        <path
          d={folderTabPath}
          transform="translate(14.713 8.037)"
          fill={tabFill}
          stroke={tabStroke}
          strokeWidth="1.334"
        />
        <path d={folderPath} fill={`url(#${gradId})`} />
        <path
          d={folderPath}
          fill="none"
          stroke={outlineStroke}
          strokeWidth="2.668"
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#${clipId})`}
        />
      </svg>
      <div
        className={`${styles.folderInner}${contentClassName ? ` ${contentClassName}` : ''}`}
        style={
          {
            '--fm-icon-color': color,
            ...(iconHoverColor ? { '--fm-icon-hover-color': iconHoverColor } : null),
          } as CSSProperties
        }
      >
        {children ??
          (Icon ? (
            <Icon size={Math.round(size * 0.42)} weight="fill" className={styles.folderIcon} />
          ) : null)}
      </div>
    </div>
  )
}
