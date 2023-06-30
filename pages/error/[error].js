import Link from 'next/link'
import { useRouter } from 'next/router'
import { Player } from '@lottiefiles/react-lottie-player'

const getContentForError = (error) => {
  switch (Number(error)) {
    case 404:
      return {
        title: 'Oi, looks like we lost this page.',
        action: (
          <>
            Take a small detour, go back to
            <Link href={'/'}>
              <a className="text-gray-400 hover:text-gray-500"> homepage</a>
            </Link>
            ,
            <Link href={'/articles'}>
              <a className="text-gray-400 hover:text-gray-500"> articles</a>
            </Link>{' '}
            or check our
            <Link href={'/videos'}>
              <a className="text-gray-400 hover:text-gray-500"> videos.</a>
            </Link>
          </>
        ),
      }

    case 500:
    default:
      return {
        title: 'Oi, looks like something went wrong.',
        action: (
          <>
            Go back to
            <Link href={'/'}>
              <a className="text-gray-400 hover:text-gray-500"> homepage</a>
            </Link>
            ,
            <Link href={'/articles'}>
              <a className="text-gray-400 hover:text-gray-500"> articles</a>
            </Link>
            or check our
            <Link href={'/videos'}>
              <a className="text-gray-400 hover:text-gray-500"> videos.</a>
            </Link>
          </>
        ),
      }
  }
}

export default function ErrorPage({ error }) {
  const router = useRouter()
  error = router.query.error || error

  const { title, action } = getContentForError(error)

  return (
    <div className="">
      <div className="lg:flex">
        <Player autoplay loop src={Number(error) === 404 ? '/404.json' : '/500.json'} />

        <div className="min-w-3xl flex min-w-fit flex-1	 flex-col items-center justify-center bg-gray-50 p-4">
          <h1 className="text-4xl xl:text-5xl">{title}</h1>
          <p className="mt-4 text-lg xl:text-2xl">{action}</p>
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err, params }) => {
  return { theme: 'green' }
}
