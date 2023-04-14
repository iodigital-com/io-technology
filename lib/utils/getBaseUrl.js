export const getBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://techhub.iodigital.com'

  return baseUrl
}
