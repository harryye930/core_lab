"use client"

import { useMemo, useState } from 'react'
import { hasKnownPublicationYear, publicationsByYear, publicationsPage } from '@/data/publications'
import SearchBar from './SearchBar'
import PublicationCitation from './PublicationCitation'

const allPublications = Object.entries(publicationsByYear).flatMap(([year, pubs]) =>
  pubs.map(pub => ({ ...pub, year })).filter(hasKnownPublicationYear)
)

const getSearchText = (publication) => {
  const authors = Array.isArray(publication.author)
    ? publication.author.join(' ')
    : publication.author || ''

  return [
    publication.title,
    authors,
    publication.year,
    publication.booktitle,
    publication.journal,
    publication.series,
  ].filter(Boolean).join(' ').toLowerCase()
}

const sortYearsDescending = (a, b) => {
  const aNum = parseInt(a)
  const bNum = parseInt(b)

  if (isNaN(aNum)) return 1
  if (isNaN(bNum)) return -1

  return bNum - aNum
}

const withReverseNumbersByYear = (groupedItems, sortedYears) => {
  const numbered = {}
  let number = sortedYears.reduce((total, year) => total + groupedItems[year].length, 0)

  for (const year of sortedYears) {
    numbered[year] = groupedItems[year].map(publication => ({
      publication,
      number: number--,
    }))
  }

  return numbered
}

const Papers = () => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return allPublications

    return allPublications.filter(pub => getSearchText(pub).includes(normalizedQuery))
  }, [query])

  const groupedFiltered = useMemo(() => (
    filtered.reduce((acc, pub) => {
      const year = pub.year || 'Unknown'
      if (!acc[year]) acc[year] = []
      acc[year].push(pub)
      return acc
    }, {})
  ), [filtered])

  const sortedYears = useMemo(
    () => Object.keys(groupedFiltered).sort(sortYearsDescending),
    [groupedFiltered]
  )

  const numberedGroups = useMemo(
    () => withReverseNumbersByYear(groupedFiltered, sortedYears),
    [groupedFiltered, sortedYears]
  )

  return (
    <section id="papers" className="w-full scroll-mt-24 px-5 py-8 sm:px-8 lg:px-12">
      <h2 className="border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]">
        {publicationsPage.papersTitle}
      </h2>

      <SearchBar
        query={query}
        setQuery={setQuery}
        placeholder={publicationsPage.searchPlaceholder}
      />

      {filtered.length === 0 ? (
        <p className="pt-5 text-slate-600">{publicationsPage.noPapersText}</p>
      ) : (
        sortedYears.map(year => (
          <div key={year} className="scroll-mt-24">
            <div className="border-y border-y-[#0a1588] py-2 text-[20px] font-semibold text-[#0a1588]">
              {year}
            </div>
            <ul className="pt-5 text-slate-800">
              {numberedGroups[year].map(({ publication: pub, number }, index) => (
                <li key={pub.doi || `${pub.title}-${index}`} className="mb-2 py-3 leading-7">
                  <PublicationCitation publication={pub} number={number} />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}

export default Papers
