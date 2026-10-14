# bigjackcn.github.io

Personal site and blog. Hugo + PaperMod, built and deployed to GitHub Pages by
[`.github/workflows/hugo.yaml`](.github/workflows/hugo.yaml) on every push to `main`.

## Everyday updates

| I want to… | Edit |
| --- | --- |
| Write a post or note | `content/posts/<slug>.md` |
| Write a system design note | `content/posts/<slug>.md` with `tags = ["System Design"]` |
| Add or reorder a project card | `content/projects/<slug>.md` (`weight` sets the order) |
| Change experience or skills | `content/about.md` |

A post starts as:

```toml
+++
date = '2026-10-14'
title = 'Designing the checkout flow'
tags = ["System Design", "Java"]
+++
```

Tags get their own index pages automatically (`/tags/system-design/`), so system
design notes stay filterable without a separate section.

## Shortcodes

```text
{{< job role="Software Engineering Intern" org="Kayi Smart Medical Technology" dates="Sep – Dec 2025" stack="Java, Python" points="First point. | Second point." >}}
{{< skills "Languages" "Java" "Python" "SQL" >}}
{{< stack "Java" "Spring Boot" "PostgreSQL" >}}
```

In `job`, `stack` and `points` are optional; `points` is split on the pipe
character, so a point cannot contain one. In `skills` the first value is the row
label. Tech icons live in
[`layouts/_partials/stack-chips.html`](layouts/_partials/stack-chips.html); a name
with no entry there renders as a plain chip rather than breaking.

## Preview locally

```sh
hugo server -D          # http://localhost:1313/
hugo --minify           # one-off build into public/
```

Push to `main` when it looks right; the workflow builds and deploys.

## Layout

```text
content/about.md            # profile page
content/posts/              # blog; _index.md sets the list page title
content/projects/           # project cards; list.html renders live previews
layouts/_shortcodes/        # job, skills, stack
layouts/_partials/          # stack-chips, extend_head (fonts + icons)
layouts/projects/list.html  # project grid
assets/css/extended/custom.css
static/whiteboard/          # blank Java editor, no compiler (self-contained)
```
