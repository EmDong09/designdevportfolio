import type { ProjectMotif } from '../content'

interface ProjectPreviewArtProps {
  motif: ProjectMotif
}

/**
 * Original, abstract per-project preview artwork (no photography, no
 * reference-site assets). Each motif loosely echoes its project's theme
 * through shape and composition rather than literal illustration.
 */
export default function ProjectPreviewArt({ motif }: ProjectPreviewArtProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="300" fill="var(--color-bg-raised)" />
      {motif === 'compass' && <CompassMotif />}
      {motif === 'ritual' && <RitualMotif />}
      {motif === 'form' && <FormMotif />}
    </svg>
  )
}

function CompassMotif() {
  return (
    <g>
      <circle cx="200" cy="150" r="110" fill="var(--color-lavender-soft)" />
      <circle cx="200" cy="150" r="70" fill="none" stroke="var(--color-accent)" strokeWidth="2" opacity="0.6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x1 = 200 + Math.cos(angle) * 78
        const y1 = 150 + Math.sin(angle) * 78
        const x2 = 200 + Math.cos(angle) * 96
        const y2 = 150 + Math.sin(angle) * 96
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-text)"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
        )
      })}
      <path d="M200 150 L245 95" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
      <path d="M200 150 L172 196" stroke="var(--color-peach)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="150" r="8" fill="var(--color-text)" />
    </g>
  )
}

function RitualMotif() {
  return (
    <g>
      <rect x="0" y="0" width="400" height="300" fill="var(--color-peach-soft)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx="120"
          cy="150"
          r={30 + i * 26}
          fill="none"
          stroke="var(--color-text)"
          strokeOpacity={0.5 - i * 0.08}
          strokeWidth="2"
        />
      ))}
      <rect x="230" y="70" width="110" height="26" rx="13" fill="var(--color-accent)" opacity="0.85" />
      <rect x="230" y="112" width="80" height="26" rx="13" fill="var(--color-text)" opacity="0.18" />
      <rect x="230" y="154" width="95" height="26" rx="13" fill="var(--color-text)" opacity="0.18" />
      <rect x="230" y="196" width="60" height="26" rx="13" fill="var(--color-text)" opacity="0.18" />
    </g>
  )
}

function FormMotif() {
  return (
    <g>
      <rect width="400" height="300" fill="var(--color-lavender-soft)" />
      <circle cx="140" cy="120" r="90" fill="var(--color-peach)" opacity="0.9" />
      <rect x="190" y="70" width="160" height="160" fill="var(--color-accent)" opacity="0.85" />
      <path d="M40 260 L200 140 L360 260 Z" fill="var(--color-text)" opacity="0.14" />
      <text
        x="60"
        y="70"
        fontFamily="var(--font-heading)"
        fontSize="42"
        fill="var(--color-text)"
        opacity="0.5"
      >
        Aa
      </text>
    </g>
  )
}
