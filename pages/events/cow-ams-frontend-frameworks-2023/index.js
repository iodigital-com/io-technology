import QRCode from 'react-qr-code'

import { PageSEO } from '@/components/SEO'
import SocialIcon from '@/components/social-icons'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getBaseUrl } from '@/lib/utils/getBaseUrl'

export const getStaticProps = () => {
  return {
    props: {
      theme: 'cow',
      useLayoutWrapper: false,
    },
  }
}

const RaffleBlock = ({ children, numberOfTickets, href }) => {
  const { theme } = useBrandingTheme()

  return (
    <a href={href} className="flex flex-col justify-center gap-4">
      <h2 className="text-center text-4xl text-white">{children}</h2>
      <div className={`bg-io_${theme}-900 relative rounded-full p-16`}>
        <QRCode
          size={200}
          bgColor="transparent"
          fgColor="#ffffff"
          value={href}
          viewBox={`0 0 256 256`}
        />
        <div
          className={`lg:translate-y-3/5 absolute left-1/2 bottom-0 translate-y-3/4 lg:-bottom-16 lg:left-3/4 lg:translate-y-0 bg-io_${theme}-800 flex aspect-1 -rotate-12 items-center justify-center rounded-full p-4 lg:p-8`}
        >
          <p className="text-center text-lg font-bold uppercase text-white">
            Win tickets
            <br />x{numberOfTickets}
          </p>
        </div>
      </div>
    </a>
  )
}

export default function COWAMSFrontendFrameworks2023() {
  const { theme } = useBrandingTheme()

  return (
    <>
      <PageSEO
        title="Events - Coven of Wisdom Amsterdam - Frontend Frameworks - 2023"
        description="What is going on with all these new frameworks like Astro, Qwik, React Server Components, RedwoodJS and SolidJS?"
      />
      <div
        className={`bg-io_${theme}-700  overflow-hidden bg-cover`}
        style={{ backgroundImage: `url('/images/cow/cow-bg-pattern.svg')` }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 py-36 lg:gap-8 lg:py-4">
          <header className="flex flex-col gap-4 text-center text-white ">
            <h1
              className={`bg-io_${theme}-900 rounded-full py-2 px-4 font-serif text-3xl font-light`}
            >
              Coven of Wisdom
            </h1>
            <p>Frontend Frameworks 2023</p>
            <img
              src="/images/cow/cow-mascotte.png"
              alt="Graphic design of a mythical creature holding an orb and hovering back and forth"
              className="animate-pulse-slowly max-w-xs"
            />
          </header>
          <main className="mb-24 flex flex-col items-center justify-center gap-36 lg:flex-row">
            <RaffleBlock
              href={`${getBaseUrl()}/events/cow-ams-frontend-frameworks-2023/raffle/js-nation-amsterdam-2023`}
              numberOfTickets={2}
            >
              JSNation Amsterdam
              <br />
              Raffle
            </RaffleBlock>
            <RaffleBlock
              href={`${getBaseUrl()}/events/cow-ams-frontend-frameworks-2023/raffle/vue-js-londen-2023`}
              numberOfTickets={1}
            >
              Vue.js London
              <br />
              Raffle
            </RaffleBlock>
          </main>
          <footer className="flex w-screen flex-col items-center justify-center gap-4 px-4  lg:flex-row lg:justify-between lg:px-16">
            <div className="hidden lg:block">
              <SocialIcon
                textClassNames={'text-white font-semibold'}
                classNames={'fill-white'}
                kind="website"
                href={`${getBaseUrl()}/events/cow-ams-frontend-frameworks-2023`}
                size="5"
              >
                {getBaseUrl()}/events/cow-ams-frontend-frameworks-2023
              </SocialIcon>
            </div>
            <ul className="flex flex-col items-center justify-center gap-4 font-semibold text-white lg:flex-row">
              <li>
                <SocialIcon
                  kind="website"
                  href="https://techhub.iodigital.com"
                  size="5"
                  textClassNames={'text-white font-semibold'}
                  classNames={'fill-white'}
                >
                  techhub.iodigital.com
                </SocialIcon>
              </li>
              <li>
                <SocialIcon
                  kind="youtube"
                  href="https://youtube.com/@io-technology"
                  size="5"
                  textClassNames={'text-white font-semibold'}
                  classNames={'fill-white'}
                >
                  youtube.com/@io-technology
                </SocialIcon>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </>
  )
}
