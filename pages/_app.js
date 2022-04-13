import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/font.css'
import '@/css/post-layout.css'
import '@/css/logo.css'
// import 'katex/dist/katex.css'
import asciiLogo from '@/lib/io'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'
import { BrandingThemeProvider } from '@/lib/hooks/useBrandingTheme'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

if (!isDevelopment) {
  console.info(asciiLogo)
  console.info('%cCheck out our latest jobs:', 'color: #ed7f53; font-size: 1.5rem')
  console.info(
    '%chttps://www.iodigital.com/en/careers/jobs?expertise=Technology',
    'font-size: 1rem'
  )
  console.info('')
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <BrandingThemeProvider theme={pageProps.theme || 'default'}>
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        {isDevelopment && isSocket && <ClientReload />}
        <Analytics />
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </BrandingThemeProvider>
    </ThemeProvider>
  )
}
