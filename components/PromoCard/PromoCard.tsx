import Link from '@/components/Link'
import Arrow from '@/data/arrow.svg'

export interface PromoCardProps {
  title: string
  ctaText: string
  ctaHref: string
  image?: string
}

const PromoCard = ({ title, ctaText, ctaHref, image }: PromoCardProps) => {
  return (
    <article className="py-8">
      <div
        className={`relative flex flex-col justify-end h-full min-h-[400px] p-10 ${
          image ? 'bg-cover bg-center bg-no-repeat' : ' bg-io_pink-500'
        }`}
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <h2 className="relative z-10 teaser-title font-semibold text-white text-5xl">{title}</h2>
        <Link
          href={ctaHref}
          aria-label={ctaText}
          className="relative z-10 group inline-flex items-center self-center rounded-full border border-white bg-white mt-6 px-6 py-2 text-md transition-colors"
        >
          <span>{ctaText}</span>
          <Arrow className="ml-2 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
        </Link>
      </div>
    </article>
  )
}

export default PromoCard
