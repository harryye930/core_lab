import Image from 'next/image';
import { projectsBySlug } from '@/data/projects';
import PublicationCitation from '@/Components/Publications/PublicationCitation';

const sortYearsDescending = (a, b) => {
  const aNum = parseInt(a)
  const bNum = parseInt(b)

  if (isNaN(aNum)) return 1
  if (isNaN(bNum)) return -1

  return bNum - aNum
}

const Project = ({ name }) => {

  const project = projectsBySlug[name]

  if (!project) {
    return (
      <section className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12'>
        <h1 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>Project not found</h1>
      </section>
    )
  }

  const publications = project.publications
  const publicationYears = Object.keys(publications || {}).sort(sortYearsDescending)

  return (
    <section className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12'>

        <h1 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>{project.name}</h1>

        <div className='grid gap-6 pt-5 md:grid-cols-[220px_1fr] md:items-start'>
            <Image
              src={project.image}
              alt={`${project.name} project image`}
              className='h-auto w-full rounded-lg border border-slate-200'
              sizes="(max-width: 768px) 100vw, 220px"
            />
            <div className='text-slate-700'>
                <p className='leading-7'>{project.description || 'Project details are being prepared.'}</p>
            </div>
        </div>

        <h2 className='mt-10 border-b border-b-slate-200 pb-3 text-xl font-semibold text-[#0b3a72]'>
            Publications
          </h2>

          {publicationYears.length === 0 && (
            <p className="pt-5 text-slate-600">No publications listed yet.</p>
          )}
    
          {publicationYears.map(year => (
            <div key={year} className="mt-6 scroll-mt-24">
              <div className="border-y border-y-[#0a1588] py-2 text-[20px] font-semibold text-[#0a1588]">
                {year}
              </div>
              <ul className="pt-5 text-slate-800">
                {publications[year].map((pub, index) => (
                  <li key={pub.doi || `${pub.title}-${index}`} className="mb-2 py-3 leading-7">
                    <PublicationCitation publication={pub} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      );
    };
    
    export default Project;
