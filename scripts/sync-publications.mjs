#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'

const ROOT = process.cwd()
const DEFAULT_CONFIG_PATH = 'Papers/semantic-scholar.config.json'
const DEFAULT_MEMBER_DATA_PATH = 'data/members/index.js'
const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1'
const PAPER_FIELDS = [
  'paperId',
  'externalIds',
  'title',
  'abstract',
  'year',
  'publicationDate',
  'venue',
  'publicationVenue',
  'publicationTypes',
  'journal',
  'url',
  'authors',
  'citationStyles',
  'isOpenAccess',
  'openAccessPdf',
].join(',')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const isBlank = value => value === undefined || value === null || String(value).trim() === ''

const cleanString = value => {
  if (isBlank(value)) return ''
  return String(value).replace(/\s+/g, ' ').trim()
}

const normalizeDoi = value => {
  if (isBlank(value)) return ''

  return cleanString(value)
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase()
}

const doiFromUrl = value => {
  const match = cleanString(value).match(/^https?:\/\/(?:dx\.)?doi\.org\/(.+)$/i)
  return match ? normalizeDoi(match[1]) : ''
}

const getPublicationDoi = publication =>
  normalizeDoi(publication.doi || publication.externalIds?.DOI) || doiFromUrl(publication.url)

const normalizeTitle = value =>
  cleanString(value)
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[{}]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const normalizeAuthorId = value => cleanString(value)

const getAuthorIds = author => {
  const ids = author.semanticScholarAuthorIds
    || author.semanticScholarAuthorId
    || author.semanticScholarId
    || author.authorId
    || []

  return (Array.isArray(ids) ? ids : [ids])
    .map(normalizeAuthorId)
    .filter(Boolean)
}

const resolvePath = filePath => path.resolve(ROOT, filePath)

const readJson = async (filePath, fallback = undefined) => {
  try {
    return JSON.parse(await fs.readFile(resolvePath(filePath), 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT' && fallback !== undefined) return fallback
    throw error
  }
}

const loadLocalEnv = async (filePath = '.env') => {
  let contents = ''

  try {
    contents = await fs.readFile(resolvePath(filePath), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (process.env[key]) continue

    process.env[key] = rawValue
      .trim()
      .replace(/^['"]|['"]$/g, '')
  }
}

const readMemberAuthors = async filePath => {
  const source = await fs.readFile(resolvePath(filePath), 'utf8')
  const executableSource = source
    .replace(/^import\s+(\w+)\s+from\s+['"][^'"]+['"];?$/gm, 'const $1 = ""')
    .replace(/\bexport\s+const\s+/g, 'const ')

  const memberGroups = vm.runInNewContext(
    `${executableSource}
;({
  professors: typeof professors === 'undefined' ? [] : professors,
  graduateStudents: typeof graduateStudents === 'undefined' ? [] : graduateStudents,
  undergraduateStudents: typeof undergraduateStudents === 'undefined' ? [] : undergraduateStudents,
  pastMembers: typeof pastMembers === 'undefined' ? [] : pastMembers,
})`,
    {},
    { timeout: 1000 }
  )

  return Object.values(memberGroups)
    .flat()
    .map(person => ({
      name: cleanString(person.name),
      aliases: (person.aliases || []).map(cleanString).filter(Boolean),
      semanticScholarAuthorIds: getAuthorIds(person),
      enabled: person.semanticScholarSyncEnabled,
    }))
    .filter(person => person.name)
}

const writeFileIfChanged = async (filePath, contents) => {
  const absolutePath = resolvePath(filePath)

  let previous = null
  try {
    previous = await fs.readFile(absolutePath, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  if (previous === contents) return false

  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  await fs.writeFile(absolutePath, contents)
  return true
}

const parseArgs = argv => {
  const options = {
    config: DEFAULT_CONFIG_PATH,
    dryRun: false,
    fromFile: '',
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--config') {
      options.config = argv[index + 1]
      index += 1
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--from-file') {
      options.fromFile = argv[index + 1]
      index += 1
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return options
}

const printHelp = () => {
  console.log(`
Usage: npm run sync:publications -- [options]

Options:
  --dry-run             Fetch and summarize without writing JSON files.
  --from-file <path>    Use an existing publication JSON file instead of the Semantic Scholar API.
  --config <path>       Use a custom config file. Defaults to ${DEFAULT_CONFIG_PATH}.

Environment:
  SEMANTIC_SCHOLAR_KEY       API key for higher Semantic Scholar rate limits.
`)
}

const buildCanonicalAuthorMaps = authors => {
  const byId = new Map()
  const byName = new Map()

  for (const author of authors) {
    const semanticScholarAuthorIds = getAuthorIds(author)
    const canonical = {
      name: cleanString(author.name),
      aliases: (author.aliases || []).map(cleanString).filter(Boolean),
      semanticScholarAuthorIds,
    }

    for (const authorId of semanticScholarAuthorIds) {
      byId.set(authorId, canonical)
    }

    for (const name of [canonical.name, ...canonical.aliases].filter(Boolean)) {
      byName.set(normalizeTitle(name), canonical)
    }
  }

  return { byId, byName }
}

const canonicalizeAuthorName = (author, canonicalAuthors) => {
  const authorId = normalizeAuthorId(author?.authorId)
  if (authorId && canonicalAuthors.byId.has(authorId)) {
    return canonicalAuthors.byId.get(authorId).name
  }

  const authorName = cleanString(author?.name)
  const byNameMatch = canonicalAuthors.byName.get(normalizeTitle(authorName))
  return byNameMatch?.name || authorName
}

const publicationKey = publication => {
  const keys = publicationKeys(publication)
  return keys[0] || ''
}

const publicationKeys = publication => {
  const keys = []
  const doi = getPublicationDoi(publication)
  if (doi) keys.push(`doi:${doi}`)

  const paperId = cleanString(publication.paperId)
  if (paperId) keys.push(`paper:${paperId}`)

  const title = normalizeTitle(publication.title)
  if (title) keys.push(`title:${title}:${publication.year || ''}`)

  return keys
}

const yearFromPublicationDate = publicationDate => {
  const match = cleanString(publicationDate).match(/^(\d{4})/)
  return match?.[1] || ''
}

const deriveEntryType = paper => {
  const publicationTypes = (paper.publicationTypes || []).map(type => type.toLowerCase())

  if (paper.journal?.name || publicationTypes.some(type => type.includes('journal'))) {
    return 'article'
  }

  if (publicationTypes.some(type => type.includes('conference') || type.includes('proceedings'))) {
    return 'inproceedings'
  }

  if (paper.externalIds?.ArXiv || publicationTypes.some(type => type.includes('preprint'))) {
    return 'misc'
  }

  return paper.venue ? 'inproceedings' : 'misc'
}

const normalizeSemanticScholarPaper = (paper, canonicalAuthors) => {
  const doi = normalizeDoi(paper.externalIds?.DOI)
  const year = paper.year || yearFromPublicationDate(paper.publicationDate) || 'Unknown'
  const title = cleanString(paper.title)
  const entryType = deriveEntryType(paper)
  const journalName = cleanString(paper.journal?.name)
  const venueName = cleanString(paper.publicationVenue?.name || paper.venue)
  const authors = (paper.authors || [])
    .map(author => canonicalizeAuthorName(author, canonicalAuthors))
    .filter(Boolean)

  const publication = {
    paperId: cleanString(paper.paperId),
    year: String(year),
    title,
    author: authors,
    ENTRYTYPE: entryType,
    ID: doi || cleanString(paper.paperId) || normalizeTitle(title).replace(/\s+/g, '-'),
  }

  if (doi) {
    publication.doi = doi
    publication.url = `https://doi.org/${doi}`
  } else if (paper.url) {
    publication.url = cleanString(paper.url)
  }

  if (paper.url) publication.semanticScholarUrl = cleanString(paper.url)
  if (paper.abstract) publication.abstract = cleanString(paper.abstract)
  if (paper.publicationDate) publication.publicationDate = cleanString(paper.publicationDate)
  if (paper.openAccessPdf?.url) publication.openAccessPdfUrl = cleanString(paper.openAccessPdf.url)
  if (paper.citationStyles?.bibtex) publication.bibtex = String(paper.citationStyles.bibtex).trim()
  if (Array.isArray(paper.publicationTypes) && paper.publicationTypes.length > 0) {
    publication.publicationTypes = paper.publicationTypes.map(cleanString).filter(Boolean)
  }

  if (entryType === 'article' && journalName) {
    publication.journal = journalName
  } else if (venueName) {
    publication.booktitle = venueName
  }

  if (paper.journal?.volume) publication.volume = cleanString(paper.journal.volume)
  if (paper.journal?.pages) publication.pages = cleanString(paper.journal.pages)

  return publication
}

const flattenPublications = data => {
  if (Array.isArray(data)) {
    return data
  }

  return Object.entries(data || {}).flatMap(([year, publications]) =>
    (publications || []).map(publication =>
      ({
        ...publication,
        year: publication.year || year,
      })
    )
  )
}

const mergePublication = (existing, incoming) => {
  const merged = { ...existing }

  for (const [key, value] of Object.entries(incoming)) {
    if (Array.isArray(value)) {
      if (value.length > 0) merged[key] = value
    } else if (!isBlank(value)) {
      merged[key] = value
    }
  }

  return merged
}

const mergePublicationLists = (...publicationLists) => {
  const publicationMap = new Map()

  for (const publicationList of publicationLists) {
    for (const publication of publicationList) {
      const keys = publicationKeys(publication)
      if (keys.length === 0) continue
      const existingKey = keys.find(key => publicationMap.has(key))

      const merged = existingKey
        ? mergePublication(publicationMap.get(existingKey), publication)
        : publication

      const existingKeys = existingKey
        ? Array.from(publicationMap.entries())
          .filter(([, value]) => value === publicationMap.get(existingKey))
          .map(([key]) => key)
        : []

      for (const key of new Set([...existingKeys, ...keys, ...publicationKeys(merged)])) {
        publicationMap.set(key, merged)
      }
    }
  }

  return Array.from(new Set(publicationMap.values()))
}

const sortYearsDescending = (a, b) => {
  const aNum = parseInt(a, 10)
  const bNum = parseInt(b, 10)

  if (Number.isNaN(aNum)) return 1
  if (Number.isNaN(bNum)) return -1

  return bNum - aNum
}

const sortPublications = publications =>
  [...publications].sort((a, b) => {
    const aYear = parseInt(a.year, 10)
    const bYear = parseInt(b.year, 10)

    if (!Number.isNaN(aYear) && !Number.isNaN(bYear) && aYear !== bYear) {
      return bYear - aYear
    }

    const aDate = cleanString(a.publicationDate)
    const bDate = cleanString(b.publicationDate)
    if (aDate && bDate && aDate !== bDate) return bDate.localeCompare(aDate)
    if (aDate && !bDate) return -1
    if (!aDate && bDate) return 1

    return cleanString(a.title).localeCompare(cleanString(b.title))
  })

const groupByYear = publications => {
  const grouped = {}

  for (const publication of sortPublications(publications)) {
    const year = publication.year || 'Unknown'
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(publication)
  }

  return grouped
}

const stringifyGroupedPublications = grouped => {
  const years = Object.keys(grouped).sort(sortYearsDescending)
  const chunks = years.map(year => {
    const items = JSON.stringify(grouped[year], null, 4)
      .split('\n')
      .map((line, index) => (index === 0 ? line : `    ${line}`))
      .join('\n')

    return `    ${JSON.stringify(year)}: ${items}`
  })

  return `{\n${chunks.join(',\n')}\n}\n`
}

const stringifyJson = value => `${JSON.stringify(value, null, 4)}\n`

const isExcluded = (publication, excludeConfig = {}) => {
  const paperIds = new Set((excludeConfig.paperIds || []).map(cleanString).filter(Boolean))
  const dois = new Set((excludeConfig.dois || []).map(normalizeDoi).filter(Boolean))
  const titles = new Set((excludeConfig.titles || []).map(normalizeTitle).filter(Boolean))

  return (
    paperIds.has(cleanString(publication.paperId)) ||
    dois.has(normalizeDoi(publication.doi)) ||
    titles.has(normalizeTitle(publication.title))
  )
}

const selectorMatches = (publication, selector) => {
  if (selector.paperId && cleanString(publication.paperId) === cleanString(selector.paperId)) {
    return true
  }

  if (selector.doi && getPublicationDoi(publication) === normalizeDoi(selector.doi)) {
    return true
  }

  if (selector.title && normalizeTitle(publication.title) === normalizeTitle(selector.title)) {
    return true
  }

  if (selector.titleIncludes) {
    const title = normalizeTitle(publication.title)
    const needles = Array.isArray(selector.titleIncludes)
      ? selector.titleIncludes
      : [selector.titleIncludes]

    return needles.every(needle => title.includes(normalizeTitle(needle)))
  }

  return false
}

const resolveSelectedPublications = ({ selectors = [], allPublications = [], fallbackPublications = [], label }) => {
  const selected = []
  const seen = new Set()
  const warnings = []

  for (const selector of selectors) {
    const match = allPublications.find(publication => selectorMatches(publication, selector))
    const fallbackMatch = match || fallbackPublications.find(publication => selectorMatches(publication, selector))

    if (!fallbackMatch) {
      warnings.push(`No publication matched ${label} selector ${JSON.stringify(selector)}.`)
      continue
    }

    const key = publicationKey(fallbackMatch)
    if (!seen.has(key)) {
      selected.push(fallbackMatch)
      seen.add(key)
    }

    if (!match) {
      warnings.push(`Used existing ${label} publication for selector ${JSON.stringify(selector)} because it was not present in the synced set.`)
    }
  }

  return { selected, warnings }
}

const fetchJsonWithRetry = async (url, apiKey, retryCount = 4) => {
  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    const response = await fetch(url, {
      headers: apiKey ? { 'x-api-key': apiKey } : {},
    })

    if (response.ok) return response.json()

    const body = await response.text()
    const canRetry = response.status === 429 || response.status >= 500

    if (canRetry && attempt < retryCount) {
      const retryAfterHeader = response.headers.get('retry-after')
      const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 2 ** attempt * 1500
      await sleep(Math.min(retryAfterMs, 60000))
      continue
    }

    throw new Error(`Semantic Scholar request failed (${response.status}): ${body}`)
  }
}

const fetchAuthorPapers = async ({ author, pageLimit, requestDelayMs, apiKey }) => {
  const authorId = normalizeAuthorId(author.semanticScholarAuthorId)
  const papers = []
  let offset = 0

  while (true) {
    const url = new URL(`${SEMANTIC_SCHOLAR_BASE_URL}/author/${encodeURIComponent(authorId)}/papers`)
    url.searchParams.set('fields', PAPER_FIELDS)
    url.searchParams.set('limit', String(pageLimit))
    url.searchParams.set('offset', String(offset))

    const response = await fetchJsonWithRetry(url, apiKey)
    const batch = response.data || []
    papers.push(...batch)

    if (typeof response.next !== 'number' || batch.length === 0) break

    offset = response.next
    if (requestDelayMs > 0) await sleep(requestDelayMs)
  }

  return papers
}

const paperSelectorRef = selector => {
  if (selector.paperId) return cleanString(selector.paperId)
  if (selector.doi) return `DOI:${normalizeDoi(selector.doi)}`
  return ''
}

const fetchIncludedPapers = async ({ selectors = [], apiKey, canonicalAuthors, requestDelayMs }) => {
  const publications = []

  for (const selector of selectors) {
    const ref = paperSelectorRef(selector)
    if (!ref) continue

    const url = new URL(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${encodeURIComponent(ref)}`)
    url.searchParams.set('fields', PAPER_FIELDS)

    const paper = await fetchJsonWithRetry(url, apiKey)
    publications.push(normalizeSemanticScholarPaper(paper, canonicalAuthors))

    if (requestDelayMs > 0) await sleep(requestDelayMs)
  }

  return publications
}

const fetchSemanticScholarPublications = async ({ config, canonicalAuthors, authors }) => {
  const apiKey = process.env.SEMANTIC_SCHOLAR_KEY || ''
  const pageLimit = config.sync?.pageLimit || 100
  const requestDelayMs = config.sync?.requestDelayMs ?? 1000
  const includedPaperSelectors = config.include?.papers || []
  const sourceAuthors = (authors || [])
    .filter(author => author.enabled !== false)
    .flatMap(author =>
      getAuthorIds(author).map(authorId => ({
        ...author,
        semanticScholarAuthorId: authorId,
      }))
    )

  if (sourceAuthors.length === 0) {
    throw new Error(`No Semantic Scholar author IDs are configured. Add semanticScholarAuthorIds values to ${config.memberData || DEFAULT_MEMBER_DATA_PATH}.`)
  }

  const publications = []
  const stats = []

  for (const author of sourceAuthors) {
    const papers = await fetchAuthorPapers({ author, pageLimit, requestDelayMs, apiKey })
    stats.push({ name: author.name, count: papers.length })
    publications.push(...papers.map(paper => normalizeSemanticScholarPaper(paper, canonicalAuthors)))
  }

  if (includedPaperSelectors.length > 0) {
    const includedPapers = await fetchIncludedPapers({
      selectors: includedPaperSelectors,
      apiKey,
      canonicalAuthors,
      requestDelayMs,
    })
    stats.push({ name: 'explicitly included papers', count: includedPapers.length })
    publications.push(...includedPapers)
  }

  return { publications, stats }
}

const summarizeOutput = ({ allPublications, posterPublications, projectPublications, changedFiles, dryRun }) => {
  console.log(`${dryRun ? 'Prepared' : 'Synced'} ${allPublications.length} total publications.`)
  console.log(`${dryRun ? 'Prepared' : 'Synced'} ${posterPublications.length} poster publications.`)

  for (const [slug, publications] of Object.entries(projectPublications)) {
    console.log(`${dryRun ? 'Prepared' : 'Synced'} ${publications.length} ${slug} project publications.`)
  }

  if (dryRun) {
    console.log('Dry run complete. No files were written.')
  } else if (changedFiles.length === 0) {
    console.log('No publication files changed.')
  } else {
    console.log(`Updated ${changedFiles.length} file(s):`)
    for (const filePath of changedFiles) console.log(`- ${filePath}`)
  }
}

const main = async () => {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    return
  }

  const config = await readJson(args.config)
  await loadLocalEnv()
  const memberAuthors = await readMemberAuthors(config.memberData || DEFAULT_MEMBER_DATA_PATH)
  const configuredAuthors = [...memberAuthors, ...(config.authors || [])]
  const canonicalAuthors = buildCanonicalAuthorMaps(configuredAuthors)
  const allOutputPath = config.outputs?.allPublications || 'Papers/papers.json'

  let fetchedPublications = []
  let fetchStats = []

  if (args.fromFile) {
    fetchedPublications = flattenPublications(await readJson(args.fromFile, {}))
    console.log(`Loaded ${fetchedPublications.length} publications from ${args.fromFile}.`)
  } else {
    const result = await fetchSemanticScholarPublications({ config, canonicalAuthors, authors: configuredAuthors })
    fetchedPublications = result.publications
    fetchStats = result.stats
  }

  for (const stat of fetchStats) {
    console.log(`Fetched ${stat.count} papers for ${stat.name}.`)
  }

  const allPublications = sortPublications(
    mergePublicationLists(fetchedPublications)
      .filter(publication => !isExcluded(publication, config.exclude))
  )

  const changedFiles = []
  const writeGroupedOutput = async (filePath, publications) => {
    const contents = stringifyGroupedPublications(groupByYear(publications))
    if (args.dryRun) return

    if (await writeFileIfChanged(filePath, contents)) {
      changedFiles.push(filePath)
    }
  }

  const writeArrayOutput = async (filePath, publications) => {
    const contents = stringifyJson(sortPublications(publications))
    if (args.dryRun) return

    if (await writeFileIfChanged(filePath, contents)) {
      changedFiles.push(filePath)
    }
  }

  await writeGroupedOutput(allOutputPath, allPublications)

  const posterConfig = config.posters || {}
  const posterFallback = flattenPublications(await readJson(posterConfig.output, []))
  const posterResult = resolveSelectedPublications({
    selectors: posterConfig.selectors || [],
    allPublications,
    fallbackPublications: posterFallback,
    label: 'poster',
  })

  if (posterConfig.output) {
    await writeArrayOutput(posterConfig.output, posterResult.selected)
  }

  const projectPublications = {}
  const warnings = [...posterResult.warnings]

  for (const [slug, projectConfig] of Object.entries(config.projects || {})) {
    const fallback = flattenPublications(await readJson(projectConfig.output, {}))
    const result = resolveSelectedPublications({
      selectors: projectConfig.selectors || [],
      allPublications,
      fallbackPublications: fallback,
      label: `${slug} project`,
    })

    projectPublications[slug] = result.selected
    warnings.push(...result.warnings)

    if (projectConfig.output) {
      await writeGroupedOutput(projectConfig.output, result.selected)
    }
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`)
  }

  summarizeOutput({
    allPublications,
    posterPublications: posterResult.selected,
    projectPublications,
    changedFiles,
    dryRun: args.dryRun,
  })
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
