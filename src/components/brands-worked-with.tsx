"use client"

import { useEffect, useRef } from "react"
import { useInView } from "motion/react"

import { TextRotate, TextRotateRef } from "@/components/ui/text-rotate"

const brandExamples = [
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    author: "Vogue",
    link: "#",
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    author: "Spotify",
    link: "#",
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    author: "Nike",
    link: "#",
  },
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    author: "Apple",
    link: "#",
  },
  {
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2070&auto=format&fit=crop",
    author: "LVMH",
    link: "#",
  },
]

function Item({
  index,
  image,
  link,
  onInView,
}: {
  index: number
  image: string
  link: string
  onInView: (inView: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
  })

  useEffect(() => {
    onInView(isInView)
  }, [isInView, onInView])

  return (
    <section
      ref={ref}
      key={index}
      className="h-full w-1/2 flex justify-center items-center snap-center"
    >
      <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
        <a href={link} target="_blank" rel="noreferrer">
          <img
            src={image}
            alt={`Example ${index + 1}`}
            className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
          />
        </a>
      </div>
    </section>
  )
}

export function BrandsWorkedWith() {
  const textRotateRef = useRef<TextRotateRef>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const isTextInView = useInView(textContainerRef, { once: true, margin: "-20% 0px -20% 0px" })

  const handleInView = (index: number, inView: boolean) => {
    if (inView && textRotateRef.current) {
      textRotateRef.current.jumpTo(index)
    }
  }

  return (
    <div className="w-full h-screen flex">
      <div className="w-full h-full relative border-t border-border/20">
        <div className="sticky top-0 h-screen w-full flex flex-col items-end justify-center text-foreground pr-4 md:pr-24">
          <div ref={textContainerRef} className="w-1/2 pl-8 md:pl-0 flex flex-col items-start justify-center">
             <p className="eyebrow text-xs uppercase tracking-widest text-muted-foreground mb-4 md:mb-8 font-sans">Brands We've Worked With</p>
            <TextRotate
              ref={textRotateRef}
              texts={brandExamples.map((image) => image.author)}
              mainClassName="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl w-full justify-start flex pt-2"
              splitLevelClassName="overflow-hidden pb-2"
              staggerFrom={"first"}
              animatePresenceMode="wait"
              loop={false}
              auto={false}
              staggerDuration={0.005}
              initial={{ opacity: 0, y: 50 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            />
          </div>
        </div>
        <div className="absolute inset-0 overflow-auto snap-y snap-mandatory hide-scrollbar">
          {brandExamples.map((brand, index) => (
            <Item
              key={index}
              index={index}
              image={brand.url}
              link={brand.link}
              onInView={(inView) => handleInView(index, inView)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
