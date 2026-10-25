import { about, identity } from '../content'
import './About.css'

export default function About() {
  return (
    <section id="about" className="about section" aria-labelledby="about-heading">
      <div className="container about__inner">
        <p className="eyebrow">About</p>
        <h2 id="about-heading" className="about__title">
          {identity.majors.join(' + ')}
        </h2>
        <p className="about__body">{about.body}</p>
      </div>
    </section>
  )
}
