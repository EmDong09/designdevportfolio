/**
 * Single source of truth for identity, copy, and optional contact/resume URLs.
 * Replace sample projects and `undefined` contact values with real content —
 * never substitute `#` for a missing destination.
 */

export interface NavLink {
  label: string
  href: string
}

export interface CallToAction {
  label: string
  href: string
}

export type ProjectMotif = 'compass' | 'ritual' | 'form'

export interface Project {
  id: string
  title: string
  isSample: boolean
  description: string
  /** Shown in the preview dialog. Keep it to the concept direction — no invented research or results. */
  overview: string
  tags: string[]
  motif: ProjectMotif
  previewAction: string
}

export type ExplorationMotif = 'drift' | 'weave' | 'fold'

export interface Exploration {
  id: string
  label: string
  caption: string
  motif: ExplorationMotif
}

export const identity = {
  name: 'Emily Dong',
  documentTitle: 'Emily Dong — UI/UX & Art + Design',
  majors: ['User Experience Design', 'Art and Design'],
  university: 'University of Michigan',
}

export const nav: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// No real resume file or URL has been supplied yet — omit the nav link rather
// than linking to a placeholder.
export const resumeUrl: string | undefined = undefined

export const hero = {
  greeting: 'Hi, I’m Emily Dong.',
  tagline:
    'Exploring the intersection of thoughtful experiences and expressive design.',
  context:
    'Studying User Experience Design + Art and Design at the University of Michigan.',
  primaryCta: { label: 'Explore my work', href: '#work' } satisfies CallToAction,
  secondaryCta: { label: 'About me', href: '#about' } satisfies CallToAction,
}

export const selectedWorkSampleNote =
  'Sample projects shown while portfolio work is being added.'

export const sampleProjectLabel = 'Sample project'

export const samplePreviewStatus =
  'Placeholder concept. A full case study will replace this once real project work is added.'

export const projects: Project[] = [
  {
    id: 'campus-compass',
    title: 'Campus Compass',
    isSample: true,
    description: 'A placeholder concept for exploring campus resources.',
    overview:
      'Concept direction: helping students find campus resources through clear wayfinding and simple navigation.',
    tags: ['UX Research', 'Interaction Design'],
    motif: 'compass',
    previewAction: 'Preview concept',
  },
  {
    id: 'everyday-rituals',
    title: 'Everyday Rituals',
    isSample: true,
    description: 'A placeholder concept for a reflective daily interface.',
    overview:
      'Concept direction: a calm interface for noticing and reflecting on small daily routines.',
    tags: ['UI Design', 'Prototyping'],
    motif: 'ritual',
    previewAction: 'Preview concept',
  },
  {
    id: 'form-and-feeling',
    title: 'Form & Feeling',
    isSample: true,
    description:
      'A placeholder exploration of typography, color, and visual storytelling.',
    overview:
      'Concept direction: testing how type, color, and composition can carry a visual story on their own.',
    tags: ['Art Direction', 'Visual Design'],
    motif: 'form',
    previewAction: 'Preview concept',
  },
]

export const about = {
  heading: 'About',
  body: 'I’m Emily, a University of Michigan student studying User Experience Design + Art and Design. This portfolio brings together my exploration of digital experiences and visual expression.',
}

export const explorations: Exploration[] = [
  {
    id: 'study-drift',
    label: 'Placeholder visual study',
    caption: 'Drift',
    motif: 'drift',
  },
  {
    id: 'study-weave',
    label: 'Placeholder visual study',
    caption: 'Weave',
    motif: 'weave',
  },
  {
    id: 'study-fold',
    label: 'Placeholder visual study',
    caption: 'Fold',
    motif: 'fold',
  },
]

export const contact = {
  heading: 'Let’s create something thoughtful.',
  // Real destinations have not been supplied yet. Leave undefined so the UI
  // falls back to a "coming soon" message instead of a dead link.
  email: undefined as string | undefined,
  linkedin: undefined as string | undefined,
  comingSoonMessage: 'Contact details coming soon.',
}

export const footer = {
  name: identity.name,
  year: new Date().getFullYear(),
  backToTopHref: '#top',
}
