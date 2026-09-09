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
  | 'instagram'

export type SocialIconSize = 5 | 6 | 7 | 8

export interface SocialIconProps {
  kind: SocialIconKind
  href: string
  size?: SocialIconSize
  title?: string
  children?: React.ReactNode
  classNames?: string
  textClassNames?: string
}
