/* eslint-disable jsx-a11y/anchor-has-content */
import NextLink from 'next/link'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import type { LinkProps } from './types'

// TODO: add these classes to the safelist
// !text-io_green-600
// !text-io_beige-600
// !text-io_blue-600
// !text-io_pink-600

const Link = ({ href, ...rest }: LinkProps) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  const { theme } = useBrandingTheme()
  const classNames = `!text-io_${theme}-600`

  if (isInternalLink) {
    return <NextLink href={href} {...rest} />
  }

  if (isAnchorLink) {
    const isFootnoteRef = !!(rest as any)['data-footnote-ref']

    if (isFootnoteRef) {
      return (
        <NextLink
          href={href}
          className={`${classNames} ml-1 font-semibold no-underline`}
          {...rest}
        />
      )
    }

    return <NextLink href={href} className={classNames} {...rest} />
  }

  return (
    <NextLink
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={classNames}
      {...rest}
    />
  )
}

export default Link
