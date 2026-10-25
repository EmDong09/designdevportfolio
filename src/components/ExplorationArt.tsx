import type { ExplorationMotif } from '../content'

interface ExplorationArtProps {
  motif: ExplorationMotif
}

/** Original abstract studies — decorative; each pairs with a visible caption. */
export default function ExplorationArt({ motif }: ExplorationArtProps) {
  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect width="300" height="300" fill="var(--color-bg-raised)" />
      {motif === 'drift' && <DriftStudy />}
      {motif === 'weave' && <WeaveStudy />}
      {motif === 'fold' && <FoldStudy />}
    </svg>
  )
}

function DriftStudy() {
  return (
    <g>
      <circle cx="150" cy="150" r="130" fill="var(--color-peach-soft)" />
      <path
        d="M30 200 C 90 120, 130 260, 190 160 S 290 60, 270 40"
        stroke="var(--color-accent)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M40 90 C 100 160, 160 40, 230 110"
        stroke="var(--color-text)"
        strokeOpacity="0.3"
        strokeWidth="4"
        fill="none"
      />
    </g>
  )
}

function WeaveStudy() {
  return (
    <g>
      <rect width="300" height="300" fill="var(--color-lavender-soft)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="20"
          y1={40 + i * 44}
          x2="280"
          y2={40 + i * 44}
          stroke="var(--color-text)"
          strokeOpacity="0.22"
          strokeWidth="3"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={40 + i * 55}
          y1="20"
          x2={40 + i * 55}
          y2="280"
          stroke="var(--color-accent)"
          strokeOpacity="0.55"
          strokeWidth="3"
        />
      ))}
      <circle cx="150" cy="150" r="26" fill="var(--color-peach)" />
    </g>
  )
}

function FoldStudy() {
  return (
    <g>
      <rect width="300" height="300" fill="var(--color-bg-raised)" />
      <polygon points="20,280 150,40 280,280" fill="var(--color-accent)" opacity="0.18" />
      <polygon points="60,280 150,110 240,280" fill="var(--color-peach)" opacity="0.65" />
      <polygon points="100,280 150,180 200,280" fill="var(--color-text)" opacity="0.8" />
      <line x1="150" y1="40" x2="150" y2="280" stroke="var(--color-text)" strokeOpacity="0.25" strokeWidth="2" />
    </g>
  )
}
