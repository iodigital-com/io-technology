'use client'

import { ReactNode } from 'react'
import Footer from '../Footer'
import SiteHeader from '../SiteHeader'

interface LayoutWrapperProps {
  children: ReactNode
  transparentHeader?: boolean
}

const LayoutWrapper = ({ children, transparentHeader = false }: LayoutWrapperProps) => {
  return (
    <>
      <SiteHeader transparentHeader={transparentHeader} />
      <div
        className={`${
          transparentHeader ? ' -mt-[var(--header-height)]' : ''
        } flex h-full flex-col justify-between`}
      >
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default LayoutWrapper
