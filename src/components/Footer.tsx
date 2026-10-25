import { footer } from '../content'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          {footer.name} &middot; {footer.year}
        </p>
        <a href={footer.backToTopHref}>Back to top</a>
      </div>
    </footer>
  )
}
