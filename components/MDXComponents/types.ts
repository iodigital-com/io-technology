import React from 'react'

export interface MDXComponentsProps {
  // MDX components are typically used as providers
  // This is for future extension
}

export interface MDXComponentMap {
  [key: string]: React.ComponentType<any>
}
