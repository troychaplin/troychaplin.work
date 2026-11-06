import {
    Container,
    ContentList,
    ContentListBody,
    ContentListExcerpt,
    ContentListItem,
    ContentListLabel,
    ContentListMeta,
    ContentListTitle,
    SectionHeader,
} from '@troychaplin/parlour-ui'
import { formatDate, getAllPosts } from '../lib/posts'

export function Blog() {
    const posts = getAllPosts()

    return (
        <Container color="light" maxWidth="alignfull" contentWidth="alignwide">
            <SectionHeader prefix="Writing · Notes" title="Things I write about." />
            {posts.length === 0 ? (
                <p>No posts yet. Check back soon.</p>
            ) : (
                <ContentList>
                    {posts.map((post) => (
                        <ContentListItem key={post.slug}>
                            <ContentListMeta>
                                <ContentListLabel color="muted">
                                    <time dateTime={post.dateISO}>{formatDate(post.date)}</time>
                                </ContentListLabel>
                            </ContentListMeta>
                            <ContentListBody>
                                <ContentListTitle level={2} href={`/blog/${post.slug}`}>
                                    {post.title}
                                </ContentListTitle>
                                {post.excerpt && <ContentListExcerpt>{post.excerpt}</ContentListExcerpt>}
                            </ContentListBody>
                        </ContentListItem>
                    ))}
                </ContentList>
            )}
        </Container>
    )
}
