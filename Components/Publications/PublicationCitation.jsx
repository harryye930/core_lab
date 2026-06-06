import React from 'react'
import Link from 'next/link'
import { members } from '@/data/members'

const normalizeName = (name) => String(name || '').trim().toLowerCase()

const memberAuthorLinks = new Map(
  members.flatMap(member =>
    [member.name, ...(member.aliases || [])]
      .filter(Boolean)
      .map(name => [normalizeName(name), member.link])
  )
)

const memberPublicationNames = new Map(
  members.flatMap(member =>
    [member.name, ...(member.aliases || [])]
      .filter(Boolean)
      .map(name => [normalizeName(name), member.publicationName || member.name])
  )
)

const getAuthors = (publication) => {
  if (!publication?.author) return []
  return Array.isArray(publication.author) ? publication.author : [publication.author]
}

const getVenue = (publication) =>
  publication?.booktitle || publication?.journal || publication?.series || ''

const AuthorList = ({
  authors,
  highlightAuthors = [],
  highlightCoreMembers = true,
  linkMemberAuthors = true,
}) => {
  const highlightedNames = highlightAuthors.map(normalizeName)

  if (authors.length === 0) return 'Unknown author'

  return authors.map((author, index) => {
    const normalizedAuthor = normalizeName(author)
    const memberLink = memberAuthorLinks.get(normalizedAuthor)
    const displayAuthor = memberPublicationNames.get(normalizedAuthor) || author
    const isHighlighted = highlightedNames.includes(normalizedAuthor)
      || (highlightCoreMembers && Boolean(memberLink))
    const authorContent = isHighlighted ? <strong>{displayAuthor}</strong> : displayAuthor

    return (
      <React.Fragment key={`${author}-${index}`}>
        {memberLink && linkMemberAuthors ? (
          <Link href={memberLink} className="font-semibold text-[#0b3a72] hover:underline">
            {authorContent}
          </Link>
        ) : (
          authorContent
        )}
        {index < authors.length - 1 && ', '}
      </React.Fragment>
    )
  })
}

const PublicationCitation = ({
  publication,
  highlightAuthors = [],
  number,
  highlightCoreMembers = true,
  linkMemberAuthors = true,
}) => {
  if (!publication) {
    return <span className="text-slate-600">Publication details unavailable.</span>
  }

  const authors = getAuthors(publication)
  const venue = getVenue(publication)
  const title = publication.title || 'Untitled publication'
  const doi = publication.doi ? String(publication.doi).trim() : ''

  return (
    <div className={number ? 'grid grid-cols-[3.25rem_1fr] gap-3' : ''}>
      {number && (
        <span className="pt-0.5 text-right font-semibold tabular-nums text-[#0b3a72]">
          {number}.
        </span>
      )}
      <span>
        <span>
          <AuthorList
            authors={authors}
            highlightAuthors={highlightAuthors}
            highlightCoreMembers={highlightCoreMembers}
            linkMemberAuthors={linkMemberAuthors}
          />.
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
      </span>
    </div>
  )
}

export default PublicationCitation
