/*
  Shared template for every markdown post in src/content/blog.
*/
import { Article, Container } from '@troychaplin/parlour-ui'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { formatDate, getPost } from '../lib/posts'
import { NotFound } from './NotFound'

export function BlogPost() {
    const { slug } = useParams()
    const post = getPost(slug)

    useEffect(() => {
        if (!post) return
        const previous = document.title
        document.title = `${post.title} · troychaplin.work`
        return () => {
            document.title = previous
        }
    }, [post])

    if (!post) return <NotFound />

    return (
        <Container color="light" maxWidth="alignfull" contentWidth="aligncontent">
            <p>
                <Link to="/blog">← All posts</Link>
            </p>
            <h1>{post.title}</h1>
            <p>
                <time dateTime={post.dateISO}>{formatDate(post.date)}</time>
                {post.tags.length > 0 && <> · {post.tags.join(', ')}</>}
            </p>
            {/* Content comes from our own repo markdown files, so rendering the HTML is safe. */}
            <Article content={post.html} />
        </Container>
    )
}
