---
title: Hello, world
date: 2026-11-05
excerpt: A first post to kick off the blog, written in plain markdown.
tags: meta, react
---

This blog is powered by markdown files that live right in the repo. Drop a new
`.md` file into `src/content/blog`, give it a title and a date, and it shows up
on the [blog page](/blog).

## What to expect

- Notes on WordPress block development
- Experiments with React and design systems
- The occasional release write-up

```ts
const post = getPost('hello-world')
console.log(post?.title)
```

Thanks for reading.
