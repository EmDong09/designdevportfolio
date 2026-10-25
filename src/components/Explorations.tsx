import { explorations } from '../content'
import ExplorationArt from './ExplorationArt'
import './Explorations.css'

export default function Explorations() {
  return (
    <section
      id="explorations"
      className="explorations section"
      aria-labelledby="explorations-heading"
    >
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Art &amp; explorations</p>
          <h2 id="explorations-heading">Visual studies</h2>
        </div>
        <ul className="explorations__grid">
          {explorations.map((study) => (
            <li key={study.id}>
              <figure className="exploration-card">
                <div className="exploration-card__art">
                  <ExplorationArt motif={study.motif} />
                </div>
                <figcaption>
                  <span className="exploration-card__caption">{study.caption}</span>
                  <span className="exploration-card__label">{study.label}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
