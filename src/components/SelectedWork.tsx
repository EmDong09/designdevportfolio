import { projects, selectedWorkSampleNote } from '../content'
import ProjectCard from './ProjectCard'
import './SelectedWork.css'

export default function SelectedWork() {
  const hasSamples = projects.some((project) => project.isSample)

  return (
    <section id="work" className="selected-work section" aria-labelledby="work-heading">
      <div className="container">
        <div className="section-heading">
          <h2 id="work-heading">Selected work</h2>
          {hasSamples && <p className="selected-work__note">{selectedWorkSampleNote}</p>}
        </div>
        <ul className="selected-work__grid">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectCard project={project} featured={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
