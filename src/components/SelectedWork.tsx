import { projects, selectedWorkSampleNote } from '../content'
import ProjectCard from './ProjectCard'
import './SelectedWork.css'

export default function SelectedWork() {
  return (
    <section id="work" className="selected-work section" aria-labelledby="work-heading">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-heading" className="font-heading selected-work__title">
            Projects I&rsquo;ve been shaping
          </h2>
          <p className="selected-work__note">{selectedWorkSampleNote}</p>
        </div>
        <ul className="selected-work__grid">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
