/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from '../Image'
import Link from '../Link'
import TOCInline from '../TOCInline'
import Pre from '../Pre'
import Heading from '../Heading'
import { LazyStackBlitz } from '../LazyStackBlitz'

interface WrapperProps {
  components?: any
  layout: string
  [key: string]: any
}

interface MDXLayoutRendererProps {
  layout: string
  mdxSource: string
  [key: string]: any
}

export const MDXComponents = {
  Image,
  TOCInline,
  LazyStackBlitz,
  a: Link,
  pre: Pre,
  h1: Heading(1),
  h2: Heading(2),
  h3: Heading(3),
  h4: Heading(4),
  h5: Heading(5),
  h6: Heading(6),
  wrapper: ({ components, layout, ...rest }: WrapperProps) => {
    const Layout = require(`../../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: MDXLayoutRendererProps) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return (
    <div>
      <MDXLayout layout={layout} components={MDXComponents} {...rest} />
    </div>
  )
}
