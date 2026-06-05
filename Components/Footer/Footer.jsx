import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { navigationItems, siteBrand } from '@/data/navigation'
import anrLogo from '@/data/navigation/assets/anr-logo.jpg'
import dsiLogo from '@/data/navigation/assets/dsi-logo.png'
import nsercSymbol from '@/data/navigation/assets/nserc-symbol-color.png'
import uoftLogo from '@/data/navigation/assets/uoft-logo.svg'

const contactEmails = [
  'learningcs.utm@utoronto.ca',
  'michael.liut@utoronto.ca',
]

const footerLinks = navigationItems.filter((item) => item.href !== '#contactus')

const sponsors = [
  {
    name: 'University of Toronto',
    href: 'https://www.viceprovostundergrad.utoronto.ca/teaching-awards-grants/learning-education-advancement-fund-leaf/',
    logo: uoftLogo,
    alt: 'University of Toronto logo',
    width: 122,
    height: 45,
  },
  {
    name: 'Data Sciences Institute',
    href: 'https://datasciences.utoronto.ca/',
    logo: dsiLogo,
    alt: 'University of Toronto Data Sciences Institute logo',
    width: 80,
    height: 45,
    className: 'rounded-sm bg-white',
  },
  {
    name: 'NSERC',
    href: 'https://nserc-crsng.canada.ca/en',
    logo: nsercSymbol,
    alt: 'Natural Sciences and Engineering Research Council of Canada symbol',
    width: 94,
    height: 45,
  },
  {
    name: 'ANR',
    href: 'https://anr.fr/en/',
    logo: anrLogo,
    alt: 'Agence Nationale de la Recherche logo',
    width: 146,
    height: 45,
    className: 'rounded-sm bg-white',
  },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='mt-16 bg-slate-950 text-slate-100' id='contactus'>
      <div className='mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12'>
        <div className='grid gap-10 lg:grid-cols-[1.2fr_1fr_1.2fr]'>
          <section aria-labelledby='footer-lab'>
            <Link href='/' className='inline-flex items-center gap-3'>
              <Image src={siteBrand.logo} alt={`${siteBrand.name} logo`} width={52} height={52} />
              <span id='footer-lab' className='text-xl font-semibold text-white'>{siteBrand.name}</span>
            </Link>
            <p className='mt-4 max-w-sm text-sm leading-6 text-slate-300'>
              Computing education research at the University of Toronto Mississauga.
            </p>
            <address className='mt-5 flex gap-3 not-italic text-sm leading-6 text-slate-300'>
              <FaMapMarkerAlt className='mt-1 h-4 w-4 shrink-0 text-blue-200' aria-hidden='true' />
              <span>
                Deerfield Hall
                <br />
                University of Toronto Mississauga
                <br />
                3359 Mississauga Road
                <br />
                Mississauga, ON L5L 1C6
              </span>
            </address>
          </section>

          <section aria-labelledby='footer-contact'>
            <h2 id='footer-contact' className='text-sm font-semibold text-white'>Contact</h2>
            <ul className='mt-4 space-y-3 text-sm'>
              {contactEmails.map((email) => (
                <li key={email} className='flex items-center gap-2'>
                  <FaEnvelope className='h-4 w-4 shrink-0 text-blue-200' aria-hidden='true' />
                  <a href={`mailto:${email}`} className='break-all text-slate-300 transition hover:text-white hover:underline'>
                    {email}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href='https://www.utm.utoronto.ca/visitors/maps-and-directions'
              className='mt-5 inline-flex text-sm font-medium text-blue-200 transition hover:text-white hover:underline'
              target='_blank'
              rel='noreferrer'
            >
              UTM maps and directions
            </a>
          </section>

          <section aria-labelledby='footer-sponsor'>
            <h2 id='footer-sponsor' className='text-sm font-semibold text-white'>Sponsors and supporters</h2>
            <div className='mt-5 flex flex-wrap items-center gap-x-7 gap-y-5'>
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.href}
                  className='flex h-12 items-center transition hover:opacity-80'
                  target='_blank'
                  rel='noreferrer'
                  aria-label={`Visit ${sponsor.name}`}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.alt}
                    width={sponsor.width}
                    height={sponsor.height}
                    className={`h-11 w-auto object-contain ${sponsor.className || ''}`}
                  />
                </a>
              ))}
            </div>
            <p className='mt-4 max-w-md text-sm leading-6 text-slate-300'>
              We acknowledge support from NSERC, the University of Toronto (Data Sciences Institute, Learning & Education Advancement Fund (LEAF), Institute for the Study of University Pedagogy), and France's Agence Nationale de la Recherche (ANR).
            </p>
            <p className='mt-2 max-w-md text-xs leading-5 text-slate-400'>
              The CORE Lab is supported by these organizations and is not a product of any sponsor or funder.
            </p>
          </section>
        </div>

        <div className='mt-10 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex sm:items-center sm:justify-between'>
          <p>&copy; {currentYear} CORE Lab, University of Toronto Mississauga.</p>
          <ul className='mt-4 flex flex-wrap gap-x-5 gap-y-2 sm:mt-0'>
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className='transition hover:text-white hover:underline'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
