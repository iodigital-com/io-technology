import Image from 'next/image'
import Link from '@/components/Link'

const VideoCard = ({ video, playButton = true }) => {
  return (
    <article className="relative flex flex-col-reverse items-center bg-gray-100 p-8">
      <div>
        <header>
          <h3 className="mb-2 text-3xl font-medium line-clamp-2">
            <span dangerouslySetInnerHTML={{ __html: video.title }}></span>
          </h3>
          <p className="hyphens-auto text-lg line-clamp-3 ">{video.description}</p>
        </header>
      </div>

      <div className="relative mb-8 w-full">
        <Image
          alt={video.title}
          src={video.thumbnails.default.url.replace('default', 'maxresdefault')}
          width={1280}
          height={720}
          unoptimized={true}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />

        {playButton && (
          <div className="absolute top-1/2 left-1/2 flex h-28 w-28 w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full bg-io_orange-500 align-middle text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="15"
              viewBox="0 0 11 15"
              fill="none"
              className="h-6 w-6"
            >
              <path
                d="M10.7841 7.18943C10.7842 7.27868 10.7638 7.3664 10.7251 7.44393C10.6864 7.52147 10.6307 7.58614 10.5635 7.63157L0.678053 14.3074C0.60981 14.3535 0.532105 14.3781 0.452826 14.3788C0.373547 14.3795 0.295516 14.3563 0.226655 14.3114C0.157794 14.2665 0.100555 14.2015 0.0607473 14.1232C0.0209397 14.0448 -1.84998e-05 13.9558 1.22529e-08 13.8652V0.513642C-1.84998e-05 0.423036 0.0209397 0.334037 0.0607473 0.255681C0.100555 0.177324 0.157794 0.112399 0.226655 0.0674965C0.295516 0.0225939 0.373547 -0.00068759 0.452826 1.54638e-05C0.532105 0.000718518 0.60981 0.025381 0.678053 0.0714994L10.5635 6.74728C10.6307 6.79272 10.6864 6.85739 10.7251 6.93492C10.7638 7.01245 10.7842 7.10017 10.7841 7.18943Z"
                fill="white"
              />
            </svg>
            <span>Play video</span>
          </div>
        )}
      </div>
      <Link href={`/videos/${video.id}`} className="absolute top-0 right-0 bottom-0 left-0 text-0">
        Go to page for {video.title}
      </Link>
    </article>
  )
}

export default VideoCard
