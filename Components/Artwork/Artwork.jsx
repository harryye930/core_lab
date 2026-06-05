"use client"

import Image from 'next/image';
import { artworkSection } from '@/data/home';

const Artwork = () => {

  return (
    <section className='relative mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12'>
      <h2 className='border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]'>{artworkSection.title}</h2>
      <p className='max-w-3xl pt-4 leading-7 text-slate-700'>{artworkSection.description}</p>
      
      <div className='my-6 grid grid-cols-auto gap-6'>
        {artworkSection.items.map((artwork, index)=>(
            <div className='rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm' key={`${artwork.artist}-${index}`}>
                <Image src={artwork.image} alt={`Artwork by ${artwork.artist}`} className='h-auto w-full rounded-md'/>
                <h3 className='my-4 text-lg font-semibold text-[#0b3a72]'>Artist: {artwork.artist}</h3>
                <p className='text-sm leading-6 text-slate-600'>{artwork.description}</p>
            </div>
        ))}
      </div>
    </section>
  )
}

export default Artwork
