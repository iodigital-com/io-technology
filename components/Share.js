import { useRouter } from 'next/router'

import LinkedInIcon from './social-icons/share-linked-in.svg'
import TwitterIcon from './social-icons/share-twitter.svg'
import FacebookIcon from './social-icons/share-facebook.svg'
import EmailIcon from './social-icons/share-email.svg'

const Share = () => {
  const { asPath } = useRouter()
  const shareURL = encodeURI(`https://techhub.iodigital.com${asPath}`)

  return (
    <ul className="flex list-none justify-between gap-8 p-0 lg:justify-start">
      <li className="m-0 p-0">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite?url=${shareURL}`}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </a>
      </li>
      <li className="m-0 p-0">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareURL}`}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </a>
      </li>
      <li className="m-0 p-0">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`}
          target="_blank"
          rel="noreferrer"
        >
          <FacebookIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </a>
      </li>
      <li className="m-0 p-0">
        <a href={`mailto:?body=${shareURL}`} target="_blank" rel="noreferrer">
          <EmailIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </a>
      </li>
    </ul>
  )
}

export default Share
