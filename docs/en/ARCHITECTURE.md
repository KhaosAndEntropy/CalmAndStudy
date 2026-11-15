# How I organised the project

I maintain one pnpm monorepo with a responsive web app that can be installed as a PWA. There is no separate Expo client.

```text
apps/web         React interface, Vite, PWA, and navigation features
packages/content versioned catalogue, editorial links, quizzes, and tutorials
packages/research adapters for public bibliographic sources
functions        Cloudflare Pages API and D1 migrations
docs             guides, decisions, and policies
```

The browser loads the versioned catalogue from `content`. Public-source search uses `research` adapters, served locally by Vite middleware or in production by Pages Functions. D1 receives reader suggestions and stores limited counters; it is not a CMS and does not publish articles automatically. OpenAlex and other catalogues help locate references, but catalogue presence does not prove a claim is true.

The Adventure mode has its own navigation groups and journey screen, while sharing the same articles, trails, tutorials, map, sources, and library as Calm Study. Its orbital depth illustration is CSS-only, so it adds no 3D dependency. Progress and scores stay on the device. The playful presentation adds no forced timer, reading lock, or penalty; keyboard access, visible focus, and reduced-motion preferences still apply.

In production, Cloudflare Pages serves the interface and Pages Functions; D1 is bound to that project. Locally, Wrangler simulates Pages and D1 using SQLite. Docker Compose starts the local stack with one command and persists its data in a local volume.

## Limits I disclose

- The catalogue still contains legacy material that has not all passed the newer evidence-record and human-review process. It must be labelled as pending; illustrative percentages are not probabilities of truth.
- A successful HTTP response, bibliographic metadata, or an open license does not prove source independence or support for a specific claim.
- A human review is required before publication. Reader suggestions never enter the catalogue automatically.
- Reading preferences and progress stay in the browser. API routes receive only the data needed for their purpose.

See the [current architecture guide](../ARQUITETURA_ATUAL.md) and [security guide](../SEGURANCA.md) for route and configuration detail.
