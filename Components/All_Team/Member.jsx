import { members, membersBySlug } from '@/data/members'
import { publicationsByYear, posterPublications } from '@/data/publications'
import Image from 'next/image'
import { FaEnvelope, FaGlobe, FaLinkedin } from 'react-icons/fa'
import { FaGoogleScholar } from 'react-icons/fa6'
import PublicationCitation from '@/Components/Publications/PublicationCitation'

const titleCaseSlug = (slug = '') =>
  slug
    .split('_')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

const normalizeName = (name) => String(name || '').trim().toLowerCase()

const getAuthors = (publication) => {
  if (!publication?.author) return []
  return Array.isArray(publication.author) ? publication.author : [publication.author]
}

const sortYearsDescending = (a, b) => {
  const aNum = parseInt(a)
  const bNum = parseInt(b)

  if (isNaN(aNum)) return 1
  if (isNaN(bNum)) return -1

  return bNum - aNum
}

const groupByYear = (items) =>
  items.reduce((acc, item) => {
    const year = item.year || 'Unknown'
    if (!acc[year]) acc[year] = []
    acc[year].push(item)
    return acc
  }, {})

const allPapers = Object.entries(publicationsByYear).flatMap(([year, items]) =>
  items.map(item => ({ ...item, year: item.year || year }))
)

const getPersonBySlug = (member) => {
  const slugName = titleCaseSlug(member)

  return membersBySlug[member]
    || members.find(person => normalizeName(person.name) === normalizeName(slugName))
}

const ContactLink = ({ icon: Icon, label, href, children }) => {
  if (!href) return null

  return (
    <li className="flex items-center gap-2">
      <Icon className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="break-all text-blue-700 hover:underline"
      >
        {children || label}
      </a>
    </li>
  )
}

const PublicationSection = ({ title, groupedItems, emptyText, highlightAuthors }) => {
  const sortedYears = Object.keys(groupedItems).sort(sortYearsDescending)

  return (
    <>
      <h2 className="mt-10 border-b border-b-slate-200 pb-3 text-xl font-semibold text-[#0b3a72]">
        {title}
      </h2>

      {sortedYears.length === 0 && <p className="pt-5 text-slate-600">{emptyText}</p>}

      {sortedYears.map(year => (
        <div key={year} className="mt-6 scroll-mt-24">
          <div className="border-y border-y-[#0a1588] py-2 text-[20px] font-semibold text-[#0a1588]">
            {year}
          </div>
          <ul className="pt-5 text-slate-800">
            {groupedItems[year].map((item, index) => (
              <li key={item.doi || `${item.title}-${index}`} className="mb-2 py-3 leading-7">
                <PublicationCitation publication={item} highlightAuthors={highlightAuthors} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

const Member = ({ member }) => {
  const slugName = titleCaseSlug(member)
  const person = getPersonBySlug(member)

  if (!person) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
        <h1 className="border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]">
          Member not found
        </h1>
      </section>
    )
  }

  const highlightAuthors = [...new Set([slugName, person.name, ...(person.aliases || [])].filter(Boolean))]
  const normalizedAuthorNames = highlightAuthors.map(normalizeName)
  const matchesMember = (publication) =>
    getAuthors(publication).some(author => normalizedAuthorNames.includes(normalizeName(author)))

  const filteredPapersByYear = groupByYear(allPapers.filter(matchesMember))
  const filteredPostersByYear = groupByYear(posterPublications.filter(matchesMember))

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
      <h1 className="border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]">
        {person.name}
      </h1>

      <div className="grid gap-6 pt-5 md:grid-cols-[220px_1fr] md:items-start">
        <Image
          src={person.image}
          alt={person.name}
          className="h-auto w-full rounded-lg border border-slate-200"
          sizes="(max-width: 768px) 100vw, 220px"
        />
        <div className="text-slate-700">
          {person.bio ? (
            <p className="leading-7">{person.bio}</p>
          ) : (
            <p className="leading-7 text-slate-600">Profile details will be added soon.</p>
          )}
          <ul className="mt-5 flex flex-col items-start gap-2 border-t border-t-slate-200 pt-4 text-sm">
            <ContactLink icon={FaGlobe} href={person.website} label="Website">
              {person.website}
            </ContactLink>
            <ContactLink icon={FaEnvelope} href={person.email ? `mailto:${person.email}` : ''} label="Email">
              {person.email}
            </ContactLink>
            <ContactLink icon={FaGoogleScholar} href={person.googlescholar} label="Google Scholar">
              Google Scholar
            </ContactLink>
            <ContactLink icon={FaLinkedin} href={person.linkedin} label="LinkedIn">
              LinkedIn
            </ContactLink>
          </ul>
        </div>
      </div>

      <PublicationSection
        title="Papers"
        groupedItems={filteredPapersByYear}
        emptyText="No papers found."
        highlightAuthors={highlightAuthors}
      />

      <PublicationSection
        title="Posters"
        groupedItems={filteredPostersByYear}
        emptyText="No posters found."
        highlightAuthors={highlightAuthors}
      />
    </section>
  )
}

export default Member
