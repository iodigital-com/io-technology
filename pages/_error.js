import ErrorPage from './error/[error]'

export default ErrorPage

ErrorPage.getInitialProps = ({ res, err, params }) => {
  let error = res ? res.statusCode : err ? err.statusCode : 500
  return { error, theme: 'black' }
}
