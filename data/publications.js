import { assets } from '@/Assets/assets'
import publicationsByYear from '@/Papers/papers.json'
import posterPublications from '@/Papers/Posters/poster_papers.json'

export const publicationsPage = {
  postersTitle: 'Poster Showcase',
  papersTitle: 'Papers',
  searchPlaceholder: 'Search by title, author, venue, or year',
  noPapersText: 'No matching papers found.',
}

export { publicationsByYear, posterPublications }

export const posterItems = [
  {
    slug: '10.1145_3724389.3730790',
    doi: '10.1145/3724389.3730790',
    conference: 'ITiCSE 2025',
    title: 'Enhancing Self-Explanation in Student Learning through Large Language Models',
    image: assets.poster1,
  },
  {
    slug: '10.1145_3724389.3730767',
    doi: '10.1145/3724389.3730767',
    conference: 'ITiCSE 2025',
    title: 'Self-Explanations: Does Timing Matter?',
    image: assets.poster2,
  },
].map(poster => ({
  ...poster,
  publication: posterPublications.find(publication => publication.doi === poster.doi),
  link: `/publications/${poster.slug}`,
}))

export const postersBySlug = Object.fromEntries(
  posterItems.map(poster => [poster.slug, poster])
)
