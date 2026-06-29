import Head from 'next/head'
import { useRouter } from 'next/router'
import removeMarkdown from 'markdown-to-text'
import siteMetadata from '@/data/siteMetadata'

interface Author {
  name: string
  avatar: string
}

interface FeaturedImage {
  url: string
}

interface DynamicOGImageParams {
  title?: string
  featuredImages?: FeaturedImage[]
  authorList?: Author[]
}

interface CommonSEOProps {
  title: string
  description: string
  ogType: string
  ogImage: URL
  twImage: URL
  canonicalUrl?: string
}

interface PageSEOProps {
  title: string
  description: string
}

interface TagSEOProps {
  title: string
  description: string
}

interface BlogSEOProps {
  authorDetails?: Author[]
  title: string
  summary: string
  date: string
  lastmod?: string
  url: string
  images?: string[]
  canonicalUrl?: string
}

const getConstructedDynamicOGImageURL = ({
  title,
  featuredImages,
  authorList,
}: DynamicOGImageParams): URL => {
  const dynamicOgImageURL = new URL(`${siteMetadata.siteUrl}/api/og`)

  const authorListFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

  const searchParams = [
    {
      key: 'title',
      value: title?.replaceAll('_', ''),
    },
    {
      key: 'author',
      value:
        authorList?.length &&
        authorListFormatter.format(authorList.map(({ name }: Author) => name)),
    },
    {
      key: 'image',
      value: featuredImages?.[0]?.url,
    },
  ]

  searchParams.forEach(
    ({ key, value }) => value && dynamicOgImageURL.searchParams.append(key, value)
  )

  return dynamicOgImageURL
}

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
  canonicalUrl,
}: CommonSEOProps) => {
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

export const PageSEO = ({ title, description }: PageSEOProps) => {
  const dynamicOgImageURL = getConstructedDynamicOGImageURL({
    title: description,
    featuredImages: [{ url: siteMetadata.siteUrl + siteMetadata.socialBanner }],
    authorList: [],
  })

  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={dynamicOgImageURL}
      twImage={dynamicOgImageURL}
      canonicalUrl={`${siteMetadata.siteUrl}`}
    />
  )
}

export const TagSEO = ({ title, description }: TagSEOProps) => {
  const dynamicOgImageURL = getConstructedDynamicOGImageURL({
    title: description,
    featuredImages: [{ url: siteMetadata.siteUrl + siteMetadata.socialBanner }],
    authorList: [],
  })

  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={dynamicOgImageURL}
        twImage={dynamicOgImageURL}
        canonicalUrl={`${siteMetadata.siteUrl}`}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${title} - RSS feed`}
          href={`${siteMetadata.siteUrl}${siteMetadata.siteLogo}`}
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
}: BlogSEOProps) => {
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
    authorList = authorDetails.map((author: Author) => {
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
    featuredImages: featuredImages.map((img) => ({ url: img.url })),
    authorList: authorDetails || [],
  })

  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={dynamicOgImageURL}
        twImage={dynamicOgImageURL}
        canonicalUrl={canonicalUrl || `${siteMetadata.siteUrl}${url}`}
      />
      <Head>
        {publishedAt && <meta property="article:published_time" content={publishedAt} />}
        {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
        <link rel="canonical" href={`${siteMetadata.siteUrl}${url}`} />
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
