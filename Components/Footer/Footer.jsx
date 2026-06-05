import { FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='mx-auto max-w-6xl px-5 pt-10 sm:px-8 lg:px-12' id='contactus'>
      <div className='mt-12 border-t border-slate-200 py-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left'>
        <p className='font-medium text-slate-700'>Contact the lab</p>
        <ul className='mt-4 flex flex-col items-start gap-2 text-sm sm:mt-0'>
            <li className='flex items-center gap-2'>
              <FaEnvelope className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true"/>
              <a href="mailto:learningcs.utm@utoronto.ca" className="break-all text-blue-700 hover:underline">learningcs.utm@utoronto.ca</a>
            </li>
            <li className='flex items-center gap-2'>
              <FaEnvelope className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true"/>
              <a href="mailto:michael.liut@utoronto.ca" className="break-all text-blue-700 hover:underline">michael.liut@utoronto.ca</a>
            </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
