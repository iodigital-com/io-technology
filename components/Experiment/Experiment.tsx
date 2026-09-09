import MarkdownRenderer from 'react-markdown-renderer'
import Image from '@/components/Image'
import Arrow from '@/data/arrow.svg'
import Link from '@/components/Link'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import SocialIcon from '@/components/social-icons'
import kebabCase from '@/lib/utils/kebabCase'

import type { Author } from '../../types'

interface ExperimentProps {
  title: string
  images?: string[]
  demo?: string
  code?: string
  authors: Author[]
  content: string
  border?: boolean
}

const Experiment = ({
  title,
  images,
  demo,
  code,
  authors,
  content,
  border = true,
}: ExperimentProps) => {
  const id = kebabCase(title)

  return (
    <article className={`border-gray-300 py-12 ${border && 'border-t'}`}>
      <div className="grid grid-cols-12">
        <div className="hidden md:col-span-3 md:mr-8 md:block xl:col-span-5">
          {images?.map((image) => (
            <div className="responsive-image-container mb-2" key={image}>
              <Image src={image} alt="Image" width={100} height={100} />
            </div>
          ))}
        </div>

        <div className={`col-span-full md:col-start-4 xl:col-start-7`}>
          <Link href={`#${id}`}>
            <h2 className="teaser-title mb-4 text-3xl">{<MarkdownRenderer markdown={title} />}</h2>
          </Link>

          {authors.map((author) => (
            <div key={author.name} className="mb-2 flex">
              <div className="w-50 h-50">
                <Image
                  src={author.avatar}
                  width={50}
                  height={50}
                  alt="avatar"
                  className="rounded-full object-cover"
                />
              </div>
              <div className="ml-2">
                <p className="mb-0">
                  <Link
                    href={`/authors/${author.slug[0]}`}
                    className={`text-io_energeticBlue-600 hover:text-io_energeticBlue-700`}
                  >
                    {author.name}
                  </Link>
                </p>
                <p className="mb-0">{author.occupation}</p>
              </div>
            </div>
          ))}

          <div className="prose">
            <MDXLayoutRenderer layout={'EmptyLayout'} mdxSource={content} />
          </div>

          <div className="flex space-x-4">
            {demo && (
              <Link
                href={demo}
                className={`relative inline-flex rounded-full border border-black px-9 py-4 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white`}
              >
                <Arrow className="mr-4 w-6" /> Demo
              </Link>
            )}
            {code && (
              <SocialIcon kind="github" href={code} size={6}>
                Code
              </SocialIcon>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default Experiment
