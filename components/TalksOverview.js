import Image from '@/components/Image'
import Tag from '@/components/Tag'
import MarkdownRenderer from 'react-markdown-renderer'

const TalksOverview = ({ talks, authors }) => {
  const renderTalks = talks.map((talk) => {
    const [author] = talk.authors.map((author) => authors[author])
    return <Talk key={talk.title} author={author} {...talk} />
  })

  return (
    <div className="container mx-auto py-10 lg:py-16">
      <ul className="grid gap-y-16 md:gap-x-4 lg:grid-cols-2 lg:gap-y-20 xl:grid-cols-3 xl:gap-x-6">
        {renderTalks}
      </ul>
    </div>
  )
}

const Talk = ({ title, summary, author, tags }) => (
  <li className="flex border-t-2 border-gray-100 pt-4">
    <div className="flex flex-col">
      <h2 className="teaser-title text-2xl">{<MarkdownRenderer markdown={title} />}</h2>
      <div className="text-body-xs mb-3 lg:mb-6">
        <p>{summary}</p>
      </div>

      <div className="flex flex-grow flex-col justify-end">
        <div className="mt-2 mb-3 flex items-center text-lg">
          <div className="flex-0 relative mr-3 inline-block h-10 w-10 overflow-hidden rounded-full">
            <Image
              key={author.name}
              src={author.avatar || '/authors/io.jpg'}
              width="100%"
              height="100%"
              alt={`avatar ${author.name}`}
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          {/* TODO: use link when author detail page is ready */}
          {/* <Link href=""> */}
          <p className="text-sm text-black">By {author.name}</p>
          {/* </Link> */}
        </div>

        <div className="mb-3 flex flex-nowrap gap-1 line-clamp-1">
          {tags.length > 0 &&
            tags.map((tag) => (
              <div key={tag} className="inline-block">
                <Tag key={tag} text={tag} />
              </div>
            ))}
        </div>
      </div>
    </div>
  </li>
)

export default TalksOverview
