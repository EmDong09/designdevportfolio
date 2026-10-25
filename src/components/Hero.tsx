import { hero } from '../content'
import HeroArt from './HeroArt'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero section" aria-labelledby="hero-heading">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 id="hero-heading" className="hero__greeting">
            {hero.greeting}
          </h1>
          <p className="hero__tagline">{hero.tagline}</p>
          <p className="hero__context">{hero.context}</p>
          <div className="hero__actions">
            <a className="button button--primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="button button--secondary" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
        <div className="hero__art">
          <HeroArt />
        </div>
      </div>
    </section>
  )
}
