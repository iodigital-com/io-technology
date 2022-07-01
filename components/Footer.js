import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="6" />
          <SocialIcon kind="github" href={siteMetadata.github} size="6" />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size="6" />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size="6" />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="6" />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size="6" />
        </div>
        <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-4 flex flex-wrap justify-center space-x-2">
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>{` • `}</div>
            <Link href="/">{siteMetadata.title}</Link>
          </div>
          <div className="mb-4 flex flex-col space-y-2 text-center md:flex-row md:space-y-0 md:space-x-2">
            {siteMetadata.legal.map((link, index) => {
              return (
                <div key={link.title}>
                  {index > 0 && <div className="mr-2 hidden md:inline-block">{` • `}</div>}
                  <Link className="" href={link.url}>
                    {link.title}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
