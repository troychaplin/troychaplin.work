import { Link } from 'react-router'

export function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        That page doesn&rsquo;t exist. <Link to="/">Back to home</Link>.
      </p>
    </>
  )
}
