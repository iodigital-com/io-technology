import dynamic from 'next/dynamic'

/**
 * Dynamically load the ReactLottiePlayer. It resolves an issue which was introduced when updating NodeJS to v22.
 *
 * @see https://github.com/LottieFiles/lottie-react/issues/149#issuecomment-2203978157
 */
export const Player = dynamic(
  async () => {
    const LottiePlayer = await import('@lottiefiles/react-lottie-player')
    return LottiePlayer.Player
  },
  { ssr: false }
)
