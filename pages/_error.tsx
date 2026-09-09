import ErrorPage from './error/[error]'

export default ErrorPage

ErrorPage.getInitialProps = () => {
  return { theme: 'green' }
}
