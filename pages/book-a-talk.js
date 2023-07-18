import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { getAuthors } from '@/lib/authors'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import Talk from '@/components/Talk'
import Image from '@/components/Image'
import sortCreation from '@/lib/utils/sortCreation'
import Contributor from '@/components/Contributor'
import SectionTitle from '@/components/SectionTitle'
import Arrow from '@/data/arrow.svg'
import Link from '@/components/Link'
import { useEffect } from 'react'

import bol from 'public/images/clients/bol.png'
import ing from 'public/images/clients/ing.png'
import jumbo from 'public/images/clients/jumbo.png'
import klm from 'public/images/clients/klm.png'
import kpn from 'public/images/clients/kpn.png'
import nn from 'public/images/clients/nn.png'

export async function getStaticProps() {
  const talkTitles = [
    'inversion-of-control-through compound-components',
    'react-server-components',
    'an-anything-to-anything-translation-device',
    'css-got-more-exciting',
    'microfrontends-the-controversy',
    'introduction-to-astro',
  ]

  const talks = await getAllFilesFrontMatter('talks')
  const talksList = talks.filter((talk) => talkTitles.includes(talk.slug)).sort(sortCreation)
  const authors = await getAuthors(talks)

  return { props: { talks: talksList, authors, theme: 'green' } }
}

export default function Talks({ talks, authors }) {
  const { theme } = useBrandingTheme()

  const allAuthors = talks
    .map((talk) => talk.authors)
    .flat()
    .filter((author, index, self) => self.indexOf(author) === index)
    .map((author) => authors[author])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          target: '#hubspotForm',

          region: 'na1',
          portalId: '513128',
          formId: 'af6d8033-3c2c-4403-8c18-07a3e99f6bcf',
        })
      }
    })
  }, [])

  return (
    <>
      <PageSEO title="Book a talk" description={siteMetadata.description} />
      <section className={`bg-io_${theme}-500`}>
        <div className="container mx-auto pt-8 pb-24 md:pb-32">
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mt-4 md:mb-10 xl:row-start-1 xl:mt-12 xl:mb-16">
              <h1 className="text-4xl md:text-5xl xl:text-7xl">
                Are you ready to be inspired? Discover{' '}
                <span className="font-serif font-light">captivating talks</span> that will ignite
                your mind!
              </h1>
            </div>
            <div className="col-start-1 col-end-12 mt-20 mb-8 grid grid-cols-2 gap-y-4 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:col-start-9 xl:row-start-1">
              {allAuthors.map((author) => (
                <Contributor key={author.slug[0]} contributor={author} link={false} />
              ))}
            </div>
            <div className="col-span-full md:col-span-7 xl:col-span-6">
              <div className="xl:w-11/12">
                <p className="mb-10 text-lg">
                  Welcome to our impressive collection of talks! Explore a world where authority in
                  Frontend/Backend development converges with the latest trends. Our passionate
                  speakers will take you on a journey through the fascinating realm of technology,
                  sharing their profound knowledge and expertise. As leading engineers working with
                  top-tier clients, including enterprise environments, we are well-versed in what's
                  happening in the market.
                </p>
                <h2 className="mb-2 text-3xl">Let us reach out to plan a talk</h2>
                <div id="hubspotForm" className="hubspot"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionTitle>
        Some of our <span className="font-serif font-light">best talks</span>
      </SectionTitle>
      <div className="container mx-auto pt-10 pb-4 lg:pt-16">
        <ul className="grid gap-y-10 md:gap-x-4 lg:grid-cols-2 lg:gap-y-12 xl:grid-cols-3 xl:gap-x-6">
          {talks.map((talk) => {
            const talkAuthors = talk.authors.map((author) => authors[author])
            return <Talk key={talk.title} {...talk} authors={talkAuthors} />
          })}
        </ul>
      </div>
      <div className="container mx-auto flex justify-end">
        <Link
          href="/talks"
          aria-label="all talks"
          className="relative inline-flex rounded-full border border-black py-4 px-9 text-base font-bold leading-none transition-colors delay-100 hover:bg-black hover:text-white"
        >
          <span>All Talks</span>
          <Arrow className="ml-4 w-6" />
        </Link>
      </div>

      <SectionTitle>
        Amazing <span className="font-serif font-light">clients</span> we work for
      </SectionTitle>

      <div className="container mx-auto mb-12">
        <ul className="relative grid grid-cols-2 items-center gap-6 md:gap-x-4 lg:grid-cols-3 lg:gap-x-12 xl:grid-cols-6 xl:gap-x-12">
          <li>
            <Image src={bol} fill alt="Bol.com" />
          </li>
          <li>
            <Image src={ing} fill alt="ING" />
          </li>
          <li>
            <Image src={jumbo} fill alt="Jumbo" />
          </li>
          <li>
            <Image src={klm} fill alt="KLM" />
          </li>
          <li>
            <Image src={kpn} fill alt="KPN" />
          </li>
          <li>
            <Image src={nn} fill alt="Nationale Nederlanden" />
          </li>
        </ul>
      </div>
    </>
  )
}
