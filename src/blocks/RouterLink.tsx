/*
  Adapter so Parlour components that render links (via LinkProvider) use
  react-router's client-side navigation. External and hash links stay plain anchors.
*/
import type { ComponentProps } from 'react'
import { Link } from 'react-router'

export function RouterLink({ href = '', ...rest }: ComponentProps<'a'>) {
    const isInternal = href.startsWith('/') && !href.startsWith('//')
    if (!isInternal) return <a href={href} {...rest} />
    return <Link to={href} {...rest} />
}
