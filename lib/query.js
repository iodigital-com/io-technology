let baseUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.VERCEL_URL

export const query = async (url) => await fetch(`${baseUrl}/api${url}`).then((res) => res.json())
