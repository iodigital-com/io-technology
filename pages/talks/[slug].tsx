import { getAllFilesFrontMatter } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'

import MarkdownRenderer from 'react-markdown-renderer'
import { getAuthors } from '@/lib/authors'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import type { ContentItem, Author } from '../../types'

export const getStaticPaths = async () => {
  const talks = await getAllFilesFrontMatter('talks')

  return {
    paths: talks.map((talk) => ({ params: { slug: talk.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async (context: { params: { slug: string } }) => {
  const talks = await getAllFilesFrontMatter('talks')

  const talkDetails = talks.find((talk) =>
    context?.params ? talk.slug === context.params.slug : false
  )

  const authors = await getAuthors(talks)
  const talkAuthors =
    talkDetails?.authors?.map((author: any) => authors[author]).filter(Boolean) || []
  return {
    props: {
      talk: talkDetails,
      authors: talkAuthors,
      theme: 'default',
    },
  }
}

interface TalkProps {
  talk: ContentItem
  authors: Author[]
}

export default function Talk({ talk, authors }: TalkProps) {
  const { theme } = useBrandingTheme()
  const author = authors?.[0]

  // Fallback for talks without valid authors
  const defaultAuthor = {
    name: 'iO',
    slug: ['io'],
    avatar: '/images/logo.png',
    occupation: 'Technology Team',
  }

  const displayAuthor = author || defaultAuthor

  return (
    <>
      <PageSEO title={`${talk.title} - ${displayAuthor.name}`} description={talk.summary} />

      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pb-12 pt-8">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 flex flex-col text-center md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              <Image
                src={displayAuthor.avatar}
                width={800}
                height={800}
                className="h-auto w-full rounded-full"
                alt={`avatar ${displayAuthor.name}`}
              />
              <div className="mt-3">
                <Link
                  href={`/authors/${displayAuthor.slug[0]}`}
                  className={`text-io_${theme}-600 hover:text-io_${theme}-700 text-xl`}
                >
                  {displayAuthor.name}
                </Link>
                <p>{displayAuthor.occupation}</p>
              </div>
            </div>

            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
              <h1 className="mb-2 text-4xl md:text-5xl xl:text-7xl">
                <MarkdownRenderer markdown={talk.title} />
              </h1>
              <p className="mb-4 text-lg">{talk.summary}</p>

              <div className="mb-3 flex flex-wrap gap-3">
                {talk.tags.length > 0 &&
                  talk.tags.map((tag: any) => (
                    <div key={tag} className="inline-block whitespace-nowrap">
                      <Tag key={tag} text={tag} />
                    </div>
                  ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {talk.video && (
                  <>
                    <dt className="sr-only">Video</dt>
                    <dd>
                      <SocialIcon kind="youtube" href={talk.video} size="5" title="Video" />
                    </dd>
                  </>
                )}
                {talk.slides && (
                  <>
                    <dt className="sr-only">Slides</dt>
                    <dd>
                      <SocialIcon kind="slide-deck" href={talk.slides} size="8" title="Slides" />
                    </dd>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
