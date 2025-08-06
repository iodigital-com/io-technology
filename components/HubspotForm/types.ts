import React from 'react'

export interface HubspotFormProps {
  portalId: string
  formId: string
  className?: string
  style?: React.CSSProperties
}

export interface HubspotFormConfig {
  portalId: string
  formId: string
  targetId?: string
}
