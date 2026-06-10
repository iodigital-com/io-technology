import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import SearchLayout from '@/layouts/SearchLayout'
import HeroSection from '@/components/HeroSection'
import generateRss from '@/lib/generate-rss'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import fs from 'fs'
import path from 'path'
import { getAuthors } from '@/lib/authors'
import type { ContentItem, AuthorsMap } from '../../types'
import { usePostSearch } from '@/lib/hooks/usePostSearch'

const root = process.cwd()

export async function getStaticPaths() {
  const tags = await getAllTags('blog')

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { tag: string } }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )

  // rss
  if (filteredPosts.length > 0) {
    const rss = await generateRss(filteredPosts, `tags/${params.tag}/feed.xml`)
    const rssPath = path.join(root, 'public', 'tags', params.tag)
    fs.mkdirSync(rssPath, { recursive: true })
    fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
  }

  const authors = await getAuthors(allPosts)

  return {
    props: {
      posts: filteredPosts,
      tag: params.tag,
      authors,
      theme: 'green',
      transparentHeader: true,
    },
  }
}

interface TagProps {
  posts: ContentItem[]
  tag: string
  authors: AuthorsMap
}

export default function Tag({ posts, tag, authors }: TagProps) {
  const title = tag?.[0]?.toUpperCase() + (tag?.split(' ').join('-').slice(1) || '')
  const { searchValue, setSearchValue, filteredPosts } = usePostSearch(posts)

  return (
    <>
      <TagSEO
        title={`#${title} - ${siteMetadata.author}`}
        description={`${title} tags - ${siteMetadata.author}`}
      />
      <HeroSection title={`All #${title} articles`}>
        <SearchLayout onChange={setSearchValue} searchPlaceholder="Search articles" />
      </HeroSection>
      <ListLayout posts={filteredPosts} authors={authors} searchValue={searchValue} />
    </>
  )
}
