import { ReactNode } from 'react'
import Link from '@/components/Link'
import Arrow from '@/data/arrow.svg'

interface ReadMoreButtonProps {
  href: string
  ariaLabel: string
  variant?: 'text' | 'button'
  size?: 'small' | 'medium' | 'large'
  children?: ReactNode
  className?: string
}

const ReadMoreButton = ({
  href,
  ariaLabel,
  variant = 'text',
  size = 'medium',
  children = 'Read more',
  className = '',
}: ReadMoreButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'rounded-full border border-black px-6 py-2 text-md transition-colors hover:bg-black hover:text-white'
      case 'text':
        return 'py-2'
      default:
        return ''
    }
  }

  const getArrowSize = () => {
    switch (size) {
      case 'small':
        return 'w-3'
      case 'medium':
        return 'w-4'
      case 'large':
        return 'w-6'
      default:
        return 'w-4'
    }
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group inline-flex items-center ${getVariantClasses()} ${className}`}
    >
      <span>{children}</span>
      <Arrow
        className={`ml-2 ${getArrowSize()} transition-transform duration-300 ease-in-out group-hover:translate-x-2`}
      />
    </Link>
  )
}

export default ReadMoreButton
