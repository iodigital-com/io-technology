let baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://io-technology-a2inete65-frontmen.vercel.app'

export const query = async (url) => await fetch(`${baseUrl}/api${url}`).then((res) => res.json())
