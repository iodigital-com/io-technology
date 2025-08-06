import { ReactNode, createElement } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps {
  id?: string
  children: ReactNode
  className?: string
}

const Heading = (level: HeadingLevel) => {
  const Tag = `h${level}` as HeadingTag

  const classes: Record<HeadingTag, string> = {
    h1: 'text-6xl',
    h2: 'text-4xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-xl font-semibold',
    h6: 'text-xl font-semibold',
  }

  return function CreateTag(props: HeadingProps) {
    return createElement(
      Tag,
      {
        id: props.id,
        className: `${classes[Tag]} ${props.className || ''}`.trim(),
      },
      props.children
    )
  }
}

export default Heading
