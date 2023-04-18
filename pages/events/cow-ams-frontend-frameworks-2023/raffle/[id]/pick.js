import { useEffect, useState } from 'react'
import { PageSEO } from '@/components/SEO'
import SocialIcon from '@/components/social-icons'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import { getBaseUrl } from '@/lib/utils/getBaseUrl'

const sentenceCase = (str) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getServerSideProps = async ({ params }) => {
  const { id } = params

  const candidates = await fetch(`${getBaseUrl()}/api/events/raffle/${id}/get`).then((res) =>
    res.json()
  )

  return {
    props: {
      theme: 'cow',
      useLayoutWrapper: false,
      title: sentenceCase(id),
      event: id,
      multipleWinnersAllowed: id === 'react-summit-amsterdam-2023',
      allCandidates: candidates || [],
    },
  }
}

export default function Raffle({ event, title, multipleWinnersAllowed, allCandidates }) {
  const { theme } = useBrandingTheme()
  const [candidates, setCandidates] = useState(allCandidates)
  const [winner, setWinner] = useState(null)
  const [higlightedCandidates, setHighlightedCandidates] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let index = 0
    let cyclesDone = 0
    let maxCycles = 5
    const updateHighlightedCandidates = () => {
      setHighlightedCandidates(candidates.slice(index, index + 3))

      if (index === candidates.length) {
        if (cyclesDone < maxCycles) {
          cyclesDone++
          index = 0
          updateHighlightedCandidates()
        } else {
          const winner = candidates[Math.floor(Math.random() * candidates.length)]
          setWinner(winner)
          setCandidates(candidates.filter((candidate) => candidate !== winner))
        }
      } else if (index < candidates.length) {
        setTimeout(() => {
          index++
          updateHighlightedCandidates()
        }, 1000 / 60)
      }
    }

    // randomly sort candidates
    setCandidates(candidates.sort(() => Math.random() - 0.5))

    updateHighlightedCandidates()
  }

  const [numberOfParticipants, setNumberOfParticipants] = useState(null)

  useEffect(() => {
    const updateStats = () => {
      fetch(`${getBaseUrl()}/api/events/raffle/${event}/get`)
        .then((res) => res.json())
        .then((participants) => {
          setNumberOfParticipants(participants?.length)
        })
        .catch((err) => {
          console.error(err)
          setNumberOfParticipants(null)
        })
    }
    const interval = setInterval(() => {
      updateStats()
    }, 10000)

    updateStats()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <PageSEO
        title="Events - Coven of Wisdom Amsterdam - Frontend Frameworks - 2023"
        description={`Win a ticket for ${title}`}
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
          <main className="my-36 flex flex-col items-center justify-center gap-8">
            <h2 className="relative text-center text-4xl uppercase text-white">
              {title}
              {numberOfParticipants >= 0 && (
                <span
                  className={`text-io_${theme}-900 absolute right-1/2 -top-4 flex origin-bottom-left -translate-y-full translate-x-1/2 items-center justify-center rounded-full bg-white  px-2 text-center text-xs font-bold lg:-top-10 lg:right-2 lg:translate-x-full lg:translate-y-0 lg:-rotate-[16deg]`}
                >
                  <span
                    className="block h-12 w-12"
                    style={{ backgroundImage: `url('/images/cow/participants.svg')` }}
                  ></span>
                  <span className="mr-4 text-lg">{numberOfParticipants}</span>
                </span>
              )}
            </h2>

            <ul
              style={{ minWidth: '60vw' }}
              className="flex h-72 flex-col items-center justify-center rounded-full bg-white p-16 text-center font-serif text-6xl font-light"
            >
              {higlightedCandidates.map((candidate, index) => (
                <li
                  key={candidate}
                  className={`text-4xl uppercase ${
                    [0, 2].includes(index) ? `text-io_${theme}-500  blur-[2px]` : 'text-5xl'
                  }`}
                >
                  {candidate}
                </li>
              ))}

              {!higlightedCandidates.length && winner && (
                <li className={`font-serif text-5xl font-light uppercase`}>{winner}</li>
              )}
            </ul>

            {(!winner || multipleWinnersAllowed) && (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <button
                  className={`rounded-xl uppercase bg-io_${theme}-900 p-5 font-bold text-white`}
                  type="submit"
                >
                  Pick {multipleWinnersAllowed && winner ? 'another' : 'a'} winner
                </button>
              </form>
            )}
          </main>
          <footer className="flex w-screen flex-col items-center justify-center gap-4 px-4 lg:flex-row lg:justify-end lg:px-16">
            <ul className="flex flex-col items-center justify-center gap-4 font-semibold text-white lg:flex-row">
              <li>
                <SocialIcon
                  kind="website"
                  href="https://techhub.iodigital.com"
                  size="5"
                  classNames="fill-white"
                  textClassNames="text-white"
                >
                  techhub.iodigital.com
                </SocialIcon>
              </li>
              <li>
                <SocialIcon
                  kind="youtube"
                  href="https://youtube.com/@io-technology"
                  size="5"
                  classNames="fill-white"
                  textClassNames="text-white"
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
