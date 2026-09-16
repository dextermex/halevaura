# halevaura. website

Marketing site for the halevaura creator app, built by Halevora and Aura.
"Your creator business, all in one app."

## Stack

- Vite 7, React 19, TypeScript
- Tailwind v4 (utility layer only; the design system lives in `src/index.css` as CSS custom properties)
- `motion` for scroll-driven and entrance animation, Lenis for smooth scrolling
- three / @react-three/fiber / drei for the chrome-pink 3D objects (hero sphere, step tiles, the merging rings, the closing sphere)

## Run

```
npm install --legacy-peer-deps
npm run dev        # local dev server
npm run build      # static build in dist/ (relative asset paths, deploys anywhere)
npm run preview
```

## Deploy on Cloudflare Pages

The build is fully static, so Cloudflare Pages serves it with no functions or config file.

1. Cloudflare dashboard, Workers & Pages, Create, Pages, Connect to Git, pick `dextermex/halevaura`.
2. Production branch: `claude/magical-cray-houdqb` (the repository's default branch). Framework preset: Vite.
   Build command `npm run build`, build output directory `dist`. No environment variables are needed;
   `.npmrc` already resolves the peer-dependency conflict.
3. Custom domains: add `halevaura.com` and `www.halevaura.com`. If the domain's DNS is on Cloudflare, the
   records are created for you. If it is elsewhere, either move the nameservers to Cloudflare or add the
   CNAME records the dashboard shows.

Every push to the production branch redeploys automatically. `public/_headers` sets long cache lifetimes
for hashed assets.

Command-line alternative (needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`):

```
npm run build
npx wrangler pages deploy dist --project-name halevaura
```

## Structure

```
index.html                 fonts, meta, OG tags
src/index.css              design tokens (colour, type scale, spacing, radius, shadow, glass, device frame, easings)
src/components.css         section layouts
src/lib/data.ts            nav, reel slots, FAQ, notifications, apply link
src/lib/motion.tsx         Reveal, Magnetic, CountUp, Sparkline helpers
src/three/ChromeObject.tsx R3F chrome-pink material and shapes (sphere, ring, pill, merge)
src/components/            Nav, Hero, Problem, HowItWorks, AppTour, Screens (in-app mockups),
                           Constellation, BehindYou (dark chapter), Team, Partnership, FAQ, FinalCTA, Footer
public/media/farm.webp     Texas phone-rack photograph
public/reels/              the four real reel frames go here, see public/reels/README.md
```

## Things to fill in

- **Reel frames**: drop `reel-1.jpg` to `reel-4.jpg` into `public/reels/` and set handle, views and note in `src/lib/data.ts`. Until then the slots render a labelled placeholder on purpose.
- **Apply link**: `APPLY_HREF` in `src/lib/data.ts` currently points at a mailto. Swap for the application form URL.
- **Numbers**: all figures inside the mockups and the operation stats are illustrative sample data, labelled as such.
- **Testimonials**: intentionally omitted until real, approved creator quotes exist.

## Motion and accessibility

Every scroll effect, 3D object and loop respects `prefers-reduced-motion` (static frames, no rAF loops, no smooth scroll). WebGL falls back to the bubble gradient when unavailable. The dark "Behind you" chapter is a scoped token override, not a global theme switch.
