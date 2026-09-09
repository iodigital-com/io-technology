import { useEffect } from 'react'

declare global {
  interface Window {
    hbspt: any
  }
}

import type { HubspotFormProps } from './types'

const HubspotForm = ({
  portalId,
  formId,
  className = '',
  style,
  isDarkBackground = false,
}: HubspotFormProps) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          target: '#hubspotForm',

          region: 'na1',
          portalId: portalId,
          formId: formId,
        })
      }
    })
  }, [portalId, formId])

  return (
    <div
      id="hubspotForm"
      className={`${className} hubspot${isDarkBackground ? ' hubspot--dark' : ''}`}
      style={style}
    ></div>
  )
}

export default HubspotForm
