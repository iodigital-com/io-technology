import { ImageResponse } from '@vercel/og'
import type { NextApiRequest } from 'next'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextApiRequest) {
  const url = new URL(req.url || '')
  const origin = url.origin
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const fallbackImage = `${origin}/images/og-default-image.png`
  const { title, author, image = fallbackImage } = queryParams

  const fontUrl = `${origin}/fonts/Manrope-Medium.ttf`

  const fontResponse = await fetch(fontUrl)
  const fontData = await fontResponse.arrayBuffer()

  if (!fontResponse.ok) {
    console.error('Failed to fetch font:', fontResponse.statusText)
  }

  // if image type is webp then use default image
  const imageSrc = image.includes('.webp') ? fallbackImage : image

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      {image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageSrc}
          alt="Open Graph background image"
          width={1200}
          height={630}
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            objectFit: 'cover',
          }}
        />
      )}
      {image && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            color: 'white',
            background: 'black',
            opacity: 0.4,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '72px',
          width: '100%',
          height: '100%',
          padding: '120px',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <svg
            width="69"
            height="48"
            viewBox="0 0 69 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M45.9979 1.73521C33.2801 1.73521 22.9956 12.0875 22.9956 24.8676C22.9956 37.6477 33.326 48 45.9979 48C58.7157 48 69.0002 37.6477 69.0002 24.8676C69.0002 12.0417 58.6698 1.73521 45.9979 1.73521ZM45.9979 13.2785C52.3338 13.2785 57.522 18.5005 57.522 24.8676C57.522 31.2347 52.3338 36.4567 45.9979 36.4567C39.6619 36.4567 34.4738 31.2347 34.4738 24.8676C34.4738 18.4547 39.6619 13.2785 45.9979 13.2785Z"
              fill="white"
            />
            <path
              d="M10.6283 17.3493L0 41.9327L11.9793 47.4214L17.2484 35.1527C20.2207 28.3726 17.2484 20.3934 10.6283 17.3493Z"
              fill="white"
            />
            <path
              d="M4.03406 0C1.03881 6.61777 4.07944 14.3534 10.7507 17.3493L16.1058 5.36576L4.03406 0Z"
              fill="white"
            />
          </svg>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              lineHeight: '28px',
              color: 'white',
              fontFamily: 'CustomFont, sans-serif',
            }}
          >
            tech_hub
          </span>
        </span>
        {title && (
          <h1
            style={{
              color: 'white',
              margin: 0,
              maxWidth: '800px',
              fontSize: '64px',
              fontWeight: 500,
              lineHeight: '80px',
              fontFamily: 'CustomFont, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h1>
        )}
        {author && (
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: 0,
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: '40px',
              color: 'white',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 0C5.82958 0 0 5.82958 0 13C0 20.1704 5.82958 26 13 26C20.1704 26 26 20.1704 26 13C26 5.82958 20.1704 0 13 0ZM2 13C2 6.93415 6.93415 2 13 2C19.0658 2 24 6.93415 24 13C24 16.033 22.7664 18.7831 20.7745 20.7749C19.7016 20.3151 18.689 19.8418 17.8932 19.4025C17.4206 19.1415 17.0522 18.9076 16.7999 18.7104C16.7156 18.6444 16.6527 18.5892 16.6075 18.5451V18.1701C17.236 17.4314 17.7245 16.5131 18.0484 15.4958C18.9429 14.6513 19.1792 13.2504 18.5056 12.1364V10.0959C18.5056 8.70083 18.1146 7.38885 17.1467 6.42845C16.1787 5.46792 14.7788 5.0033 13.0582 5.0033C11.3375 5.0033 9.93725 5.46791 8.96864 6.42813C8.00003 7.38835 7.60814 8.70033 7.60814 10.0959V12.14C6.93715 13.2529 7.17089 14.6512 8.06479 15.4973C8.38869 16.5171 8.87729 17.4362 9.50622 18.1754V18.5583C9.46895 18.5955 9.41243 18.6477 9.32891 18.7144C9.09334 18.9025 8.74636 19.1259 8.29302 19.3772C7.47976 19.8281 6.41686 20.3184 5.25825 20.8075C3.24715 18.8132 2 16.0496 2 13ZM7.01532 22.226C8.73878 23.3478 10.7946 24 13 24C15.2264 24 17.3003 23.3353 19.0337 22.1939C18.2706 21.8486 17.5471 21.496 16.9266 21.1534C16.4115 20.869 15.9396 20.5765 15.568 20.286C15.382 20.1405 15.2021 19.9809 15.0503 19.8081C14.9049 19.6425 14.7412 19.4156 14.6528 19.1323L14.6075 18.9868V18.8345V17.7836V17.3759L14.8924 17.0845C15.4514 16.5128 15.9258 15.6771 16.2145 14.6489L16.3109 14.3056L16.6027 14.1008C16.9152 13.8814 17.0012 13.4139 16.73 13.0806L16.5056 12.8049V12.4494V10.0959C16.5056 9.06089 16.2201 8.32655 15.738 7.84816C15.256 7.36991 14.4321 7.0033 13.0582 7.0033C11.6842 7.0033 10.8594 7.36992 10.3767 7.84848C9.89394 8.32705 9.60814 9.0614 9.60814 10.0959V12.452V12.8064L9.38496 13.0817C9.11378 13.4163 9.19898 13.8833 9.51286 14.1048L9.80339 14.3097L9.89931 14.6521C10.1881 15.6827 10.6625 16.5182 11.2213 17.0898L11.5062 17.3812V17.7889V18.8398V18.9922L11.4608 19.1377C11.3034 19.642 10.8953 20.023 10.5769 20.2772C10.2171 20.5646 9.76145 20.8499 9.26276 21.1264C8.61284 21.4867 7.84071 21.8586 7.01532 22.226ZM16.5269 18.4557C16.5272 18.456 16.5277 18.4568 16.5285 18.458L16.5269 18.4557Z"
                fill="white"
              />
            </svg>
            <span
              style={{
                fontFamily: 'CustomFont, sans-serif',
              }}
            >
              written by {author}
            </span>
          </p>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'CustomFont',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
