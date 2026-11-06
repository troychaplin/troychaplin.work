/*
  Blog post loader. Every markdown file in src/content/blog is bundled at build
  time; the filename (minus .md) becomes the post's slug.
*/
import { marked } from 'marked'

export interface Post {
    slug: string
    title: string
    date: Date
    dateISO: string
    excerpt?: string
    tags: string[]
    draft: boolean
    html: string
}

const files = import.meta.glob('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

// Splits `---` fenced front matter from the body and reads simple `key: value` lines.
function parseFrontMatter(raw: string): { data: Record<string, string>; body: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) return { data: {}, body: raw }

    const data: Record<string, string> = {}
    for (const line of match[1].split(/\r?\n/)) {
        const idx = line.indexOf(':')
        if (idx === -1) continue
        const key = line.slice(0, idx).trim()
        // Strip trailing `# comments` and optional surrounding quotes.
        const value = line
            .slice(idx + 1)
            .replace(/\s+#.*$/, '')
            .trim()
            .replace(/^(['"])(.*)\1$/, '$2')
        if (key) data[key] = value
    }
    return { data, body: match[2] }
}

// Parses YYYY-MM-DD as a local date so it never shifts a day in negative-UTC timezones.
function parseDate(value: string | undefined, file: string): Date {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) {
        throw new Error(`[blog] ${file}: front matter needs a "date: YYYY-MM-DD" (got ${JSON.stringify(value)})`)
    }
    const [, y, m, d] = match.map(Number)
    const date = new Date(y, m - 1, d)
    if (date.getMonth() !== m - 1 || date.getDate() !== d) {
        throw new Error(`[blog] ${file}: "${value}" is not a valid date`)
    }
    return date
}

function toPost(path: string, raw: string): Post {
    const file = path.split('/').pop()!
    const slug = file.replace(/\.md$/, '')
    const { data, body } = parseFrontMatter(raw)
    const date = parseDate(data.date, file)

    return {
        slug,
        title: data.title || slug,
        date,
        dateISO: data.date,
        excerpt: data.excerpt || undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        draft: data.draft === 'true',
        html: marked.parse(body, { async: false }),
    }
}

const posts: Post[] = Object.entries(files)
    .map(([path, raw]) => toPost(path, raw))
    .filter((post) => !(import.meta.env.PROD && post.draft))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

export function getAllPosts(): Post[] {
    return posts
}

export function getPost(slug: string | undefined): Post | undefined {
    return posts.find((post) => post.slug === slug)
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long' })

export function formatDate(date: Date): string {
    return dateFormatter.format(date)
}
