import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/font.css'
import '@/css/post-layout.css'
import '@/css/talk-layout.css'
import '@/css/logo.css'
// import 'katex/dist/katex.css'
import asciiLogo from '@/lib/io'
import { ThemeProvider } from 'next-themes'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/Analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'
import { BrandingThemeProvider } from '@/lib/hooks/useBrandingTheme'
import Head from '@/components/Head'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

if (!isDevelopment) {
  console.info(asciiLogo)
  console.info('%cCheck out our latest jobs:', 'color: #ed7f53; font-size: 1.5rem')
  console.info(
    '%chttps://www.iodigital.com/en/careers/jobs?expertise=Technology',
    'font-size: 1rem'
  )
  console.info(' ')
}

export default function App({ Component, pageProps }) {
  const theme = pageProps.theme || 'default'

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <BrandingThemeProvider theme={theme}>
        <Head />
        {isDevelopment && isSocket && <ClientReload />}
        <Analytics />
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </BrandingThemeProvider>
    </ThemeProvider>
  )
}
