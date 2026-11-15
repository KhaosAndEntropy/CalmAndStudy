# Project decisions and timeline

I record the product decisions I made separately from technical implementation recommendations. Dates below describe approximate project phases reconstructed from the repository and project records; they are not public launch dates.

| Period         | Decision or phase                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10 Nov 2026    | I started with short curiosity articles, topic choice, random discovery, learning paths, images, and references.                                                                                   |
| 10–11 Nov 2026 | I expanded the catalogue and added topic relationships, tutorials, exercises, reading suggestions, and public-source search with explicit criteria.                                                |
| 11–12 Nov 2026 | I consolidated the responsive PWA, accessibility, visual preferences, reading tools, progress, engagement, and navigation improvements.                                                            |
| 12–13 Nov 2026 | I strengthened the API, validation, D1, privacy, request limits, CI, static analysis, and passive scanning. I chose GitHub–Cloudflare integration for deployment after checks.                     |
| 13–14 Nov 2026 | I chose MIT for code and CC BY 4.0 for original text, kept the project free, opened contribution paths, and defined two learning modes with shared editorial standards and attention to wellbeing. |
| 15 Nov 2026    | I began the Sala de Calma e Estudo rebrand and repository migration, with documentation organised in Portuguese, English, and Spanish.                                                             |

The name **Sala de Calma e Estudo** was suggested by the AI assistant while we explored names; I chose to keep it, partly for its feminine representation in a context where women are often undervalued. The platform welcomes people of every gender.

## Decisions I own

Free, respectful, accessible learning; public and verifiable sources; transparent uncertainty; human review before publication; calm and playful study paths with the same evidence bar; educational and constructive topics; no explicit, illegal, abusive, or disinformation-promoting content; privacy and wellbeing; MIT code and CC BY 4.0 original text while preserving third-party licenses.

## Technical recommendations

React, Vite, pnpm, Cloudflare Pages/Functions and D1, Docker Compose, workflow names, package boundaries, and automated checks are implementation means. I can revisit them if another approach preserves low cost, security, clarity, and the commitments above.

The source repository contains earlier commits and authorship data. A clean destination repository avoids copying that history verbatim; this summary preserves context without republishing personal details in new documents. Future commits should use the public pseudonym and a GitHub noreply address when available.
