/**
 * Original abstract composition bridging interface structure (grid, node)
 * and expressive mark-making (the sweeping stroke). Purely decorative.
 */
export default function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 420 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="230" cy="190" r="150" fill="var(--color-lavender-soft)" />
      <path
        d="M70 330 C 150 220, 180 140, 120 40"
        stroke="var(--color-peach)"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g stroke="var(--color-text)" strokeOpacity="0.14" strokeWidth="1">
        <line x1="40" y1="60" x2="40" y2="420" />
        <line x1="120" y1="60" x2="120" y2="420" />
        <line x1="200" y1="60" x2="200" y2="420" />
        <line x1="40" y1="100" x2="360" y2="100" />
        <line x1="40" y1="180" x2="360" y2="180" />
        <line x1="40" y1="260" x2="360" y2="260" />
      </g>
      <path
        d="M90 300 C 160 380, 260 380, 330 300 S 400 160, 330 90"
        stroke="var(--color-accent)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="330" cy="90" r="9" fill="var(--color-accent)" />
      <circle cx="90" cy="300" r="9" fill="var(--color-accent)" />
    </svg>
  )
}
