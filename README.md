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
