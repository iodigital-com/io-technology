import { ReactNode, AnchorHTMLAttributes, MouseEventHandler, TouchEventHandler } from 'react'

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  className?: string
  children: ReactNode
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>
  onClick?: MouseEventHandler<HTMLAnchorElement>
  onTouchStart?: TouchEventHandler<HTMLAnchorElement>
  onTouchEnd?: TouchEventHandler<HTMLAnchorElement>
}
