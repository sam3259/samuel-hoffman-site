# Samuel Hoffman portfolio

A portfolio built with Next.js, TypeScript, and an editorial interaction system.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run check
```

The `check` script runs ESLint, TypeScript, Prettier verification, and the production build.
The repository targets Node.js 22 in local version managers and CI.

## Site features

- Full-viewport typographic introduction
- Live Eastern Time display
- Email and LinkedIn contact rows
- Seven project sections, with photos, videos, and supporting PDFs where supplied
- Separate image reels for each `g[number]-[index]` photo group, ordered by image index
- Image reels sized to each photo's proportions, except the fixed-frame Maglev and final Navigator reels
- Mouse, keyboard, and touch controls for reels
- Browser-compatible MP4 videos with poster frames and native playback controls, including a two-video nozzle reel
- Two photos and résumé/coursework downloads on the About Me page
- IntersectionObserver-powered active-project navigator
- About page with copy adapted from the previous portfolio
- Responsive and reduced-motion behavior
- Metadata, sitemap, and robots routes

## Adding content

Edit project names, roles, years, and descriptions in `content/site.ts`. Put project assets in the matching folder under `public/media`. The server-side catalog in `content/media.ts` discovers them when the site builds:

- `g1-1.jpg`, `g1-2.jpg`, etc. form one reel in numeric photo order. A different group number creates another reel; the group number does not imply chronology.
- Other JPG, PNG, WebP, and AVIF files appear individually.
- MP4 files appear with playback controls. A matching `video-name-poster.jpg` supplies the preview frame and proportions. The nozzle videos share a reel.
- PDFs appear as document links.

The browser uses converted JPEGs for HEIC photos and MP4s for the original MOV clips. Original captures and full-resolution masters are kept locally under the Git-ignored `source-assets` folder; the web-ready versions in `public/media` are the files that deploy. The About Me images are currently referenced directly from `app/about/page.tsx`.

## Deployment

Import this repository into Vercel, set `NEXT_PUBLIC_SITE_URL`, and connect `samuel-hoffman.com` plus `www.samuel-hoffman.com`. Cloudflare can remain the DNS provider.
