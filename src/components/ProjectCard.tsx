import { useCallback, useRef, useState } from 'react'
import { sampleProjectLabel, samplePreviewStatus, type Project } from '../content'
import ProjectPreviewArt from './ProjectPreviewArt'
import PreviewDialog from './PreviewDialog'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const dialogTitleId = `${project.id}-dialog-title`

  const closePreview = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  const tagList = (
    <ul className="project-card__tags" aria-label="Disciplines">
      {project.tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  )

  return (
    <article className={featured ? 'project-card project-card--featured' : 'project-card'}>
      <div className="project-card__preview">
        <ProjectPreviewArt motif={project.motif} />
      </div>
      <div className="project-card__body">
        {project.isSample && <p className="sample-label">{sampleProjectLabel}</p>}
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        {tagList}
        <button
          ref={triggerRef}
          type="button"
          className="button button--secondary project-card__action"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${project.previewAction}: ${project.title}`}
        >
          {project.previewAction}
        </button>
      </div>

      <PreviewDialog isOpen={isOpen} onClose={closePreview} titleId={dialogTitleId}>
        {project.isSample && <p className="sample-label">{sampleProjectLabel}</p>}
        <h2 id={dialogTitleId} className="preview-dialog__title">
          {project.title}
        </h2>
        <p>{project.overview}</p>
        {project.isSample && <p className="preview-dialog__status">{samplePreviewStatus}</p>}
        {tagList}
      </PreviewDialog>
    </article>
  )
}
