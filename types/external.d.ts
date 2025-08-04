// Type declarations for external modules without TypeScript support
// This MUST be a .d.ts file because it contains ambient module declarations

declare module 'react-markdown-renderer' {
  import React, { ReactNode } from 'react'
  interface MarkdownRendererProps {
    markdown: string
    className?: string
    components?: Record<string, React.ComponentType<any>>
    options?: Record<string, unknown>
  }
  const MarkdownRenderer: React.FC<MarkdownRendererProps>
  export default MarkdownRenderer
}

declare module 'markdown-to-text' {
  function removeMarkdown(markdown: string): string
  export = removeMarkdown
}

// Global file type declarations for webpack/Next.js
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const ReactComponent: FC<SVGProps<SVGElement>>
  export default ReactComponent
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}
