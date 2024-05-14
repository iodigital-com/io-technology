import { useEffect } from 'react'

const HubspotForm = ({ portalId, formId, className, style }) => {
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
  }, [])

  return <div id="hubspotForm" className={`${className} hubspot`} style={style}></div>
}

export default HubspotForm
