import NextHead from 'next/head'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const Head = () => {
  let { theme } = useBrandingTheme()
  if (theme === 'default') {
    theme = 'black'
  }

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href={`/favicons/apple-icon-${theme}-57x57.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href={`/favicons/apple-icon-${theme}-60x60.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href={`/favicons/apple-icon-${theme}-72x72.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`/favicons/apple-icon-${theme}-76x76.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href={`/favicons/apple-icon-${theme}-114x114.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href={`/favicons/apple-icon-${theme}-120x120.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href={`/favicons/apple-icon-${theme}-144x144.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`/favicons/apple-icon-${theme}-152x152.png`}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/favicons/apple-icon-${theme}-180x180.png`}
        type="image/png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/favicons/favicon-${theme}-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={`/favicons/favicon-${theme}-96x96.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/favicons/favicon-${theme}-16x16.png`}
      />
      <link rel="manifest" href={`/favicons/manifest.json`} />
    </NextHead>
  )
}

export default Head
