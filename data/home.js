import { assets } from '@/Assets/assets'

export const aboutContent = {
  title: 'CORE Lab',
  paragraphs: [
    'CORE Lab (Computational Research and Education) studies how people learn, teach, and work with computing.',
    'Our research spans computing education, assessment design, educational data mining, student experience, and human-centered AI tools for learning and research.',
    'The lab brings together faculty, graduate students, and undergraduate researchers from the University of Toronto and partner institutions.',
  ],
}

export const artworkSection = {
  title: 'Lab Artwork',
  description: 'A small archive of artwork, office decorations, and visual notes made by lab members.',
  items: [
    {
      artist: 'Jess',
      description: 'A decorated name card for Michael, made after an introduction to research that turned into an ongoing collaboration.',
      image: assets.ml_name,
    },
    {
      artist: 'Jess',
      description: 'A decorated name card for Andrew, part of a growing collection of office-door artwork.',
      image: assets.ap_name,
    },
    {
      artist: 'Jess',
      description: "A decorated name card for Lisa, continuing the lab's informal office-art tradition.",
      image: assets.lz_name,
    },
    {
      artist: 'Jess',
      description: 'A long-running whiteboard piece built up across office hours, with room for new additions over time.',
      image: assets.whiteboard,
    },
    {
      artist: 'Jess',
      description: "End-of-year decorations from Andrew's office, including a few carefully guarded Pokemon cards.",
      image: assets.door,
    },
    {
      artist: 'Jess',
      description: 'A Tetris-inspired window installation chosen for its color, simplicity, and easy reconfiguration.',
      image: assets.window,
    },
  ],
}
