'use client'

import { useState, useEffect } from 'react'

interface LazyStackBlitzProps {
  src: string
  title?: string
}

export const LazyStackBlitz = ({ src, title = 'Open in StackBlitz' }: LazyStackBlitzProps) => {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const linkUrl = src.replace('?embed=1&', '?').replace('&view=editor', '').replace('embed=1', '')

  if (isMobile) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        Open in StackBlitz
      </a>
    )
  }

  return (
    <iframe
      loading="lazy"
      width="100%"
      height="600"
      src={src}
      frameBorder="0"
      allowFullScreen
      title={title}
    />
  )
}

export default LazyStackBlitz
