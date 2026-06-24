import React from 'react'

type SocialIconKind =
  | 'mail'
  | 'github'
  | 'facebook'
  | 'youtube'
  | 'linkedin'
  | 'x'
  | 'website'
  | 'slide-deck'

export interface SocialIconProps {
  kind: SocialIconKind
  href: string
  size?: string | number
  title?: string
  children?: React.ReactNode
  classNames?: string
  textClassNames?: string
}
