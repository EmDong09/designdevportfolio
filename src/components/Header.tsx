import { identity, nav, resumeUrl } from '../content'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="wordmark">
          {identity.name}
        </a>
        <nav aria-label="Primary">
          <ul className="site-header__links">
            {nav.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            {resumeUrl && (
              <li>
                <a href={resumeUrl}>Resume</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
