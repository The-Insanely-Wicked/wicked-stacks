# Publishing a DoodleAI blog post

Drop one HTML file into `blog/`. That's the whole job — the index page and
the RSS feed rebuild themselves on deploy.

The file needs three things in its `<head>`:

```html
<title>Your Post Title</title>
<meta name="order" content="2" />
<meta name="date" content="2026-09-04" />
<meta name="description" content="One sentence that shows on the blog index and in the feed." />
```

- **date** decides ordering — newest first.
- **order** only breaks ties between posts sharing a date; lower shows first.
  Leave it out and it defaults to last.
- **description** is reused as the card text and the feed summary, so write it
  like a sentence someone reads, not a keyword list.

Copy an existing post as your starting point; the styles are inline.

Never hand-edit the card list in `blog/index.html` — everything between the
`POSTS:START` and `POSTS:END` markers is overwritten on every build.
