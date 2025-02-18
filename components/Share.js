import { useRouter } from 'next/router'

import LinkedInIcon from './social-icons/share-linked-in.svg'
import TwitterIcon from './social-icons/share-twitter.svg'
import FacebookIcon from './social-icons/share-facebook.svg'
import EmailIcon from './social-icons/share-email.svg'
import Link from './Link'

const Share = () => {
  const { asPath } = useRouter()
  const shareURL = encodeURI(`https://techhub.iodigital.com${asPath}`)

  return (
    <ul className="flex list-none justify-between gap-8 p-0 lg:justify-start">
      <li className="m-0 p-0">
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite?url=${shareURL}`}
          target="_blank"
          rel="noreferrer"
          title="LinkedIn"
        >
          <LinkedInIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </Link>
      </li>
      <li className="m-0 p-0">
        <Link
          href={`https://twitter.com/intent/tweet?text=${shareURL}`}
          target="_blank"
          rel="noreferrer"
          title="Twitter"
        >
          <TwitterIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </Link>
      </li>
      <li className="m-0 p-0">
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`}
          target="_blank"
          rel="noreferrer"
          title="Facebook"
        >
          <FacebookIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </Link>
      </li>
      <li className="m-0 p-0">
        <Link href={`mailto:?body=${shareURL}`} target="_blank" rel="noreferrer" title="Email">
          <EmailIcon className="h-10 w-10 lg:h-14 lg:w-14" />
        </Link>
      </li>
    </ul>
  )
}

export default Share
