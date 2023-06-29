/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

// TODO: add these classes to the safelist
// !text-io_blue-600
// !text-io_electric_blue-600
// !text-io_orange-600
// !text-io_rouge-600
// !text-io_black-600

const CustomLink = ({ href, ...rest }) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  const { theme } = useBrandingTheme()
  const classNames = `!text-io_${theme}-600`

  if (isInternalLink) {
    return (
      <Link href={href} className={classNames}>
        <a {...rest} />
      </Link>
    )
  }

  if (isAnchorLink) {
    const isFootnoteRef = !!rest['data-footnote-ref']

    if (isFootnoteRef) {
      return <a href={href} className={`${classNames} ml-1 font-semibold no-underline`} {...rest} />
    }

    return <a href={href} className={classNames} {...rest} />
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} className={classNames} {...rest} />
  )
}

export default CustomLink
