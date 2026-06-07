# Research Lab Website

Showcases CORE research lab!

## Structure
- **/app** – Routes for the website (`/projects`, `/publications`, `/team`)
- **/Assets** – Static assets, mostly profile pictures
- **/Components** – Reusable components used across `/app`
- **/Papers** – Paper and poster data. All the publications are stored in `.bib` files, which are converted into `.json` via `convert_papers.py`
(No database was used because at the time I didn't really know how to use them, and also the website that Andrew made also just stored them into local .bib files)

## Tech Stack
- [React](https://reactjs.org/) with [Next.js](https://nextjs.org/)  
- JavaScript  
- [Tailwind CSS](https://tailwindcss.com/)  

## Getting Started
To run the project locally:
```bash
git clone <repo-url>
cd research-lab-website
npm install
npm run dev
```

## Updating Publications
Publication metadata can be synced from Semantic Scholar:

```bash
npm run sync:publications
```

Before running the sync, add each person's `semanticScholarAuthorIds` beside their member record in `data/members/index.js`.
The publication JSON is generated from Semantic Scholar author IDs plus explicitly included Semantic Scholar paper IDs in `Papers/semantic-scholar.config.json`; legacy local bibliography records are not preserved automatically.
Set `SEMANTIC_SCHOLAR_KEY` in your local environment if you have an API key; the script will still run without one, but Semantic Scholar may rate-limit unauthenticated requests.

The sync keeps the website's existing JSON data contract:
- `Papers/papers.json` powers the publications list, search, filtering, and team pages.
- `Papers/Posters/poster_papers.json` powers poster detail citations.
- `Papers/Projects/*_papers.json` powers project publication lists.

Project and poster membership is intentionally configured by DOI, Semantic Scholar paper ID, or exact title in `Papers/semantic-scholar.config.json`. That keeps publication metadata automated while preserving curated website grouping.

Useful checks:

```bash
npm run sync:publications -- --dry-run
npm run sync:publications -- --from-file Papers/papers.json --dry-run
```
