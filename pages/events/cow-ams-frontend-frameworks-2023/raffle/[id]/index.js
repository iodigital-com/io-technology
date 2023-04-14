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

  return {
    props: {
      theme: 'cow',
      useLayoutWrapper: false,
      title: sentenceCase(id),
      event: id,
    },
  }
}

export default function Raffle({ event, title }) {
  const { theme } = useBrandingTheme()
  const [enteredEmail, setEnteredEmail] = useState(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem(`${event}:email`)

    if (storedEmail) {
      fetch(`${getBaseUrl()}/api/events/raffle/${event}/get?email=${storedEmail}`)
        .then((res) => res.json())
        .then(({ email }) => {
          setEnteredEmail(email)
        })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const name = e.target.name.value

    const response = await fetch(`/api/events/raffle/${event}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    }).then((res) => res.json())

    if (response.error) {
      console.error(response.error)
    } else {
      setEnteredEmail(response.email)
      localStorage.setItem(`${event}:email`, response.email)
    }
  }

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
          <main className="my-12 flex flex-col items-center justify-center gap-8 ">
            <h2 className="text-center text-4xl uppercase text-white">{title}</h2>

            {enteredEmail ? (
              <h2 className="text-xl text-white">
                You've entered this raffle with <strong>{enteredEmail}</strong>
              </h2>
            ) : (
              <form className="flex w-64 flex-col p-5 lg:w-96" onSubmit={handleSubmit}>
                <input
                  className="p-5"
                  type="name"
                  name="name"
                  placeholder="Name*"
                  autoFocus
                  required
                />
                <input
                  className="p-5"
                  type="email"
                  name="email"
                  placeholder="Email address*"
                  required
                />
                <button
                  className={`uppercase bg-io_${theme}-900 p-5 font-bold text-white`}
                  type="submit"
                >
                  Enter
                </button>
                <p className="mt-6 text-white">
                  *The information will only be used for the purpose of selecting the winner and
                  will be deleted thereafter
                </p>
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
