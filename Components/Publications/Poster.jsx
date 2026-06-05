import { postersBySlug } from '@/data/publications';
import Image from 'next/image';
import PublicationCitation from './PublicationCitation';

const Poster = ({ doi }) => {
  const poster = postersBySlug[doi]

  if (!poster) {
    return (
      <section className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12'>
        <h1 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>Poster not found</h1>
      </section>
    )
  }

  const pub = poster.publication

  return (
    <section className='mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12'>
        <h1 className='border-b border-b-slate-200 pb-3 text-center text-2xl font-semibold text-[#0b3a72]'>{poster.title}</h1>
        <div className='grid gap-8 pt-6 lg:grid-cols-[minmax(280px,0.9fr)_1fr] lg:gap-12'>
            <Image
              src={poster.image}
              alt={`${poster.conference} poster: ${poster.title}`}
              className='h-auto w-full rounded-lg border border-slate-200'
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <div className='w-full'>
                <h2 className='mt-2 border-b border-b-slate-200 pb-3 text-xl font-semibold text-[#0b3a72]'>Publication</h2>
                <div className="mb-2 py-3 leading-7 text-slate-800" key={pub?.doi || pub?.title}>
                    <PublicationCitation publication={pub} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Poster
