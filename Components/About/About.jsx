import { aboutContent } from '@/data/home'

const About = () => {
  return (
    <section className='mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12'>
        <h1 className='border-b border-b-slate-200 pb-3 text-3xl font-semibold text-[#0b3a72]'>{aboutContent.title}</h1>
        <div className='space-y-4 pt-4 text-base leading-7 text-slate-700'>
            {aboutContent.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>
    </section>
  )
}

export default About
