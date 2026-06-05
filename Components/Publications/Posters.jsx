"use client"

import { useEffect, useState } from 'react'
import { posterItems, publicationsPage } from '@/data/publications'
import Image from "next/image";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";
import Link from 'next/link';

const posterSlides = posterItems
const slideIntervalMs = 6000

const Posters = () => {
    const length = posterSlides.length

    const [current, setCurrent] = useState(0)
    
    const previousSlide = () => {
        setCurrent(prev => (prev === 0 ? length - 1 : prev - 1))
    }

    const nextSlide = () => {
        setCurrent(prev => (prev === length - 1 ? 0 : prev + 1))
    }

    useEffect(() => {
        if (length <= 1) return

        const interval = setInterval(() => {
            setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
        }, slideIntervalMs);

        return () => clearInterval(interval)
    }, [length]);

  if (length === 0) return null

  return (
    <section id="posters" className='w-full scroll-mt-24 px-5 pb-5 pt-10 sm:px-8 lg:px-12'>
        <h2 className="border-b border-b-slate-200 pb-3 text-2xl font-semibold text-[#0b3a72]">
            {publicationsPage.postersTitle}
        </h2>
        <div className="relative flex items-center overflow-hidden pt-5">
            <button
              type="button"
              onClick={previousSlide}
              className="cursor-pointer rounded-full p-2 text-4xl text-[#0b3a72] transition hover:bg-slate-100"
              aria-label="Show previous poster"
            >
                <BsFillArrowLeftCircleFill aria-hidden="true" />
            </button>

            <div className="flex-1 overflow-hidden">
                <div
                className="flex transition duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
                >
                {posterSlides.map((poster, index) => (
                    <Link href={poster.link} key={index} className='flex-none w-full'>
                        <div className="cursor-pointer rounded-lg border border-slate-200 px-4 pb-12 pt-5 transition hover:border-[#7b94b6] hover:shadow-sm sm:px-10">
                        <Image
                          src={poster.image}
                          alt={`${poster.conference} poster: ${poster.title}`}
                          className="mx-auto mb-3 h-auto max-h-[32rem] w-auto"
                          sizes="(max-width: 768px) 80vw, 520px"
                        />
                        <p className="border-t-2 border-t-[#0b3a72] pt-3 text-sm leading-6 text-[#0b3a72] hover:underline sm:text-base">
                            <b>{poster.conference}</b> - {poster.title}
                        </p>
                        </div>
                    </Link>
                ))}
                </div>
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="cursor-pointer rounded-full p-2 text-4xl text-[#0b3a72] transition hover:bg-slate-100"
              aria-label="Show next poster"
            >
                <BsFillArrowRightCircleFill aria-hidden="true" />
            </button>

            <div className='absolute bottom-0 py-4 flex justify-center gap-7 w-full'>
                {posterSlides.map((poster, index)=>{
                    return (
                        <button
                          type="button"
                          key={poster.link}
                          className={`h-3 w-3 cursor-pointer rounded-full ${index===current? 'bg-slate-700' : 'bg-slate-300'}`}
                          onClick={()=>{setCurrent(index)}}
                          aria-label={`Show poster ${index + 1}`}
                        />
                    )
                })}
            </div>
        </div>
    </section>
  )
}

export default Posters
