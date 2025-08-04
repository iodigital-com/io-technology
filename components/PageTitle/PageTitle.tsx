import React from 'react'

interface PageTitleProps {
  children: React.ReactNode
  className: string
}

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={
        'text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 ' +
        className
      }
    >
      {children}
    </h1>
  )
}
