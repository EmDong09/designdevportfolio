import { useRef, useState } from 'react'
import type { Project } from '../content'
import ProjectPreviewArt from './ProjectPreviewArt'
import PreviewDialog from './PreviewDialog'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const dialogTitleId = `${project.id}-dialog-title`

  const closePreview = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <article className="project-card">
      <div className="project-card__preview">
        <ProjectPreviewArt motif={project.motif} />
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <ul className="project-card__tags" aria-label={`${project.title} disciplines`}>
          {project.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        <button
          ref={triggerRef}
          type="button"
          className="button button--secondary project-card__action"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
        >
          {project.previewAction}
        </button>
      </div>

      <PreviewDialog isOpen={isOpen} onClose={closePreview} titleId={dialogTitleId}>
        <h3 id={dialogTitleId} className="preview-dialog__title">
          {project.title}
        </h3>
        <p className="preview-dialog__status">Sample project — placeholder concept</p>
        <p>{project.description}</p>
        <ul className="project-card__tags" aria-label={`${project.title} disciplines`}>
          {project.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </PreviewDialog>
    </article>
  )
}
