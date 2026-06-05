import michaelNameCard from './assets/ml_name.png'
import andrewNameCard from './assets/ap_name.png'
import lisaNameCard from './assets/lz_name.png'
import whiteboardArtwork from './assets/whiteboard.png'
import doorArtwork from './assets/door.png'
import windowArtwork from './assets/window.png'

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
      image: michaelNameCard,
    },
    {
      artist: 'Jess',
      description: 'A decorated name card for Andrew, part of a growing collection of office-door artwork.',
      image: andrewNameCard,
    },
    {
      artist: 'Jess',
      description: "A decorated name card for Lisa, continuing the lab's informal office-art tradition.",
      image: lisaNameCard,
    },
    {
      artist: 'Jess',
      description: 'A long-running whiteboard piece built up across office hours, with room for new additions over time.',
      image: whiteboardArtwork,
    },
    {
      artist: 'Jess',
      description: "End-of-year decorations from Andrew's office, including a few carefully guarded Pokemon cards.",
      image: doorArtwork,
    },
    {
      artist: 'Jess',
      description: 'A Tetris-inspired window installation chosen for its color, simplicity, and easy reconfiguration.',
      image: windowArtwork,
    },
  ],
}
