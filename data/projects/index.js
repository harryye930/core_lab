import voiceexImage from './assets/voiceex.png'
import copilotlensImage from './assets/copilotlens.png'
import arcImage from './assets/arc.png'
import genericProjectImage from './assets/generic.png'
import voiceexPublications from '@/Papers/Projects/voiceex_papers.json'
import copilotlensPublications from '@/Papers/Projects/copilotlens_papers.json'
import arcPublications from '@/Papers/Projects/arc_papers.json'

export const projectsPage = {
  activeTitle: 'Active Projects',
  activeDescription: 'Current research projects from the lab.',
  pastTitle: 'Past Projects',
  pastDescription: 'Past projects will be added as the archive is updated.',
}

const projectEntries = [
  {
    slug: 'voiceex',
    name: 'VoiceEx',
    image: voiceexImage,
    description: 'VoiceEx supports voice-based self-explanations for student learning. Instructors can prompt students to reflect on a question or topic, record a response, and receive feedback or follow-up questions based on that explanation.',
    publications: voiceexPublications,
    isActive: true,
  },
  {
    slug: 'copilotlens',
    name: 'CopilotLens',
    image: copilotlensImage,
    description: 'CopilotLens explores how AI code-generation tools can become more transparent through post-hoc summaries and on-demand explanations, supporting more trustworthy human-AI collaboration in software development.',
    publications: copilotlensPublications,
    isActive: true,
  },
  {
    slug: 'arc',
    name: 'ARC',
    image: arcImage,
    description: 'ARC is an automated review companion for systematic literature reviews, built around user-centered design and support for scholarly sensemaking.',
    publications: arcPublications,
    isActive: true,
  },
  {
    slug: 'quickta',
    name: 'QuickTA',
    image: genericProjectImage,
    description: '',
    publications: {},
    isActive: false,
  },
  {
    slug: 'medbot',
    name: 'MedBot',
    image: genericProjectImage,
    description: '',
    publications: {},
    isActive: false,
  },
  {
    slug: 'vizproject',
    name: 'Naaz Viz Project',
    image: genericProjectImage,
    description: '',
    publications: {},
    isActive: false,
  },
]

export const projects = projectEntries.map(project => ({
  ...project,
  link: `/projects/${project.slug}`,
}))

export const activeProjects = projects.filter(project => project.isActive)

export const projectsBySlug = Object.fromEntries(
  projects.map(project => [project.slug, project])
)
