import React from 'react'

const normalizeName = (name) => String(name || '').trim().toLowerCase()

const getAuthors = (publication) => {
  if (!publication?.author) return []
  return Array.isArray(publication.author) ? publication.author : [publication.author]
}

const getVenue = (publication) =>
  publication?.booktitle || publication?.journal || publication?.series || ''

const AuthorList = ({ authors, highlightAuthors = [] }) => {
  const highlightedNames = highlightAuthors.map(normalizeName)

  if (authors.length === 0) return 'Unknown author'

  return authors.map((author, index) => {
    const isHighlighted = highlightedNames.includes(normalizeName(author))

    return (
      <React.Fragment key={`${author}-${index}`}>
        {isHighlighted ? <strong>{author}</strong> : author}
        {index < authors.length - 1 && ', '}
      </React.Fragment>
    )
  })
}

const PublicationCitation = ({ publication, highlightAuthors = [] }) => {
  if (!publication) {
    return <span className="text-slate-600">Publication details unavailable.</span>
  }

  const authors = getAuthors(publication)
  const venue = getVenue(publication)
  const title = publication.title || 'Untitled publication'
  const doi = publication.doi ? String(publication.doi).trim() : ''

  return (
    <>
      <span>
        <AuthorList authors={authors} highlightAuthors={highlightAuthors} />.
      </span>
      <span className="ml-1">
        {publication.url ? (
          <a
            href={publication.url}
            className="text-blue-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            &quot;{title}&quot;
          </a>
        ) : (
          <span>&quot;{title}&quot;</span>
        )}
        {venue && <span className="italic"> {venue}.</span>}
        {publication.year && <span> ({publication.year}).</span>}
        {doi && (
          <span className="ml-1">
            [
            <a
              href={`https://doi.org/${doi}`}
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              doi
            </a>
            ]
          </span>
        )}
      </span>
    </>
  )
}

export default PublicationCitation
