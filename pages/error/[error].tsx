import Link from '@/components/Link'
import React from 'react'
import { useRouter } from 'next/router'
import { Player } from '@/components/LottiePlayer'

interface ErrorContent {
  title: string
  description: React.ReactNode
  image: string
}

const getContentForError = (error: string | number): ErrorContent => {
  switch (Number(error)) {
    case 404:
      return {
        title: 'Oi, looks like we lost this page.',
        description: (
          <>
            Take a small detour, go back to
            <Link href={'/'} className="text-gray-400 hover:text-gray-500">
              homepage
            </Link>
            ,
            <Link href={'/articles'} className="text-gray-400 hover:text-gray-500">
              articles
            </Link>{' '}
            or check our
            <Link href={'/videos'} className="text-gray-400 hover:text-gray-500">
              videos.
            </Link>
          </>
        ),
        image: '/404.json',
      }

    case 500:
    default:
      return {
        title: 'Oi, looks like something went wrong.',
        description: (
          <>
            Go back to
            <Link href={'/'} className="text-gray-400 hover:text-gray-500">
              homepage
            </Link>
            ,
            <Link href={'/articles'} className="text-gray-400 hover:text-gray-500">
              articles
            </Link>
            or check our
            <Link href={'/videos'} className="text-gray-400 hover:text-gray-500">
              videos.
            </Link>
          </>
        ),
        image: '/500.json',
      }
  }
}

interface ErrorPageProps {
  error: string | number
}

export default function ErrorPage({ error }: ErrorPageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const errorParam = router.query.error
  const actualError = Array.isArray(errorParam) ? errorParam[0] : errorParam || error

  const { title, description } = getContentForError(actualError || '404')

  return (
    <div className="">
      <div className="lg:flex">
        <h1>LOTTIE HIER</h1>
        <Player autoplay loop src={Number(error) === 404 ? '/404.json' : '/500.json'} />

        <div className="min-w-3xl flex min-w-fit flex-1	 flex-col items-center justify-center p-4">
          <h1 className="text-4xl xl:text-5xl">{title}</h1>
          <p className="mt-4 text-lg xl:text-2xl">{description}</p>
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = () => {
  return { theme: 'green' }
}
