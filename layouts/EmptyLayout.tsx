import { ReactNode } from 'react'

interface EmptyLayoutProps {
  children: ReactNode
}

export default function EmptyLayout({ children }: EmptyLayoutProps) {
  return <>{children}</>
}
