let baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `https://${process.env.VERCEL_URL}`

export const query = async (url) => {
  console.log('GOING TO FETCH')
  console.log(url)
  console.log('')
  return await fetch(`${baseUrl}/api${url}`).then((res) => res.json())
}
