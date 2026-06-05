import { projectsPage } from '@/data/projects'

const Past = () => {
  return (
    <section className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12'>
        <h2 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>{projectsPage.pastTitle}</h2>
        <p className='pt-4 leading-7 text-slate-700'>
            {projectsPage.pastDescription}
        </p>
    </section>
  )
}

export default Past
