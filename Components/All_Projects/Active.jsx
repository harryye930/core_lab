import Image from 'next/image'
import Link from 'next/link'
import { activeProjects, projectsPage } from '@/data/projects';

const Active = () => {
  return (
    <section className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12'>
        <h1 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>{projectsPage.activeTitle}</h1>
        <p className='max-w-3xl pb-6 pt-4 leading-7 text-slate-700'>
            {projectsPage.activeDescription}
        </p>
        <div className="space-y-8">
        {activeProjects.map((project)=>(
            <article className="grid gap-5 rounded-lg border border-slate-200 p-4 transition hover:border-[#7b94b6] hover:shadow-sm lg:grid-cols-[220px_1fr]" key={project.link}>
            <Image
              src={project.image}
              alt={`${project.name} project image`}
              className='h-auto w-full rounded-md border border-slate-100'
              sizes="(max-width: 1024px) 100vw, 220px"
            />
            <div>
                <Link href={project.link} className='inline-block text-2xl font-semibold text-[#002a5c] hover:underline'>{project.name}</Link>
                <p className='mt-2 leading-7 text-slate-700'>{project.description}</p>
            </div>
        </article>
        ))}
        </div>
    </section>
  )
}

export default Active
