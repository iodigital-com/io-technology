import { ReactNode } from 'react'

interface HeroSectionProps {
  title?: string
  description?: string
  children?: ReactNode
  isDarkBackground?: boolean
}

const HeroSection = ({ title, description, children, isDarkBackground }: HeroSectionProps) => {
  return (
    <div className="relative bg-[url('/shifting-bg-sm.jpg')] md:bg-[url('/shifting-bg-md.jpg')] lg:bg-[url('/shifting-bg-lg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative pt-28 pb-16">
        <div className="container mx-auto grid grid-cols-12 gap-x-5">
          {title && (
            <h1
              className={`relative z-10 col-span-full text-5xl font-medium md:col-span-8 ${
                isDarkBackground ? 'text-white' : ''
              }`}
            >
              {title}
            </h1>
          )}
          {description && (
            <span
              className={`col-span-full mt-6 lg:mt-12 md:col-span-8 xl:flex xl:items-center ${
                isDarkBackground ? 'text-white' : ''
              }`}
            >
              <p>{description}</p>
            </span>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default HeroSection
