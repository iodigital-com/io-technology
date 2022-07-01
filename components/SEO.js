import Head from 'next/head'
import { useRouter } from 'next/router'
import removeMarkdown from 'markdown-to-text'
import siteMetadata from '@/data/siteMetadata'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

const getConstructedDynamicOGImageURL = ({ title, featuredImages, authorList, date }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let { theme } = useBrandingTheme()

  const dynamicOgImageURL = new URL('https://og-image-io.vercel.app/')
  const fileType = 'png'
  const authorListFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

  dynamicOgImageURL.pathname = `${encodeURIComponent(title)}.${fileType}`

  const searchParams = [
    {
      key: 'teaserImage',
      value: featuredImages?.length && featuredImages[0].url,
    },
    {
      key: 'author',
      value: authorList?.length && authorListFormatter.format(authorList.map(({ name }) => name)),
    },
    {
      key: 'authorImage',
      value:
        authorList?.length &&
        authorList[0].avatar &&
        `https://techhub.iodigital.com${authorList[0].avatar}`,
    },
    {
      key: 'blendTheme',
      value: theme,
    },
    {
      key: 'date',
      value: date?.length && new Intl.DateTimeFormat('en').format(new Date(date)),
    },
    {
      key: 'domain',
      value: 'tech_hub',
    },
  ]

  searchParams.forEach(
    ({ key, value }) => value && dynamicOgImageURL.searchParams.append(key, value)
  )

  return dynamicOgImageURL
}

const CommonSEO = ({ title, description, ogType, ogImage, twImage, canonicalUrl }) => {
  const router = useRouter()

  return (
    <Head>
      <title>{removeMarkdown(title)}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={removeMarkdown(title)} />
      <meta property="og:image" content={ogImage.href} key={ogImage.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitter} />
      <meta name="twitter:title" content={removeMarkdown(title)} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage.href} />
      <link
        rel="canonical"
        href={canonicalUrl ? canonicalUrl : `${siteMetadata.siteUrl}${router.asPath}`}
      />
    </Head>
  )
}

export const PageSEO = ({ title, description }) => {
  const dynamicOgImageURL = getConstructedDynamicOGImageURL({
    title: description,
    featuredImages: [{ url: siteMetadata.siteUrl + siteMetadata.socialBanner }],
  })

  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={dynamicOgImageURL}
      twImage={dynamicOgImageURL}
    />
  )
}

export const TagSEO = ({ title, description }) => {
  const dynamicOgImageURL = getConstructedDynamicOGImageURL({
    title: description,
    featuredImages: [{ url: siteMetadata.siteUrl + siteMetadata.socialBanner }],
  })
  const router = useRouter()
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={dynamicOgImageURL}
        twImage={dynamicOgImageURL}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  )
}

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  canonicalUrl,
}) => {
  const publishedAt = new Date(date).toISOString()
  const modifiedAt = new Date(lastmod || date).toISOString()
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${img}`,
    }
  })

  let authorList
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
        avatar: author.avatar,
      }
    })
  } else {
    authorList = {
      '@type': 'Person',
      name: siteMetadata.author,
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  }

  const dynamicOgImageURL = getConstructedDynamicOGImageURL({
    title,
    featuredImages,
    authorList,
    date,
  })

  return (
    <>
      <CommonSEO
        title={`${title} - ${siteMetadata.author}`}
        description={summary}
        ogType="article"
        ogImage={dynamicOgImageURL}
        twImage={dynamicOgImageURL}
        canonicalUrl={canonicalUrl}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  )
}
