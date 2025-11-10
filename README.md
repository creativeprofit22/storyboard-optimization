# Storyboard Optimization Brief

Interactive web presentation revealing how current storyboarding tools are killing creativity.

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

Then visit: `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## Tech Stack

- **Framework:** Next.js 14 (React)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Deployment:** Vercel
- **Language:** TypeScript

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Home page (8 sections)
│   └── globals.css      # Global styles + design tokens
├── components/
│   ├── sections/        # Page sections (coming)
│   ├── cards/           # Reusable card components (coming)
│   └── ui/              # Base UI components (coming)
├── lib/                 # Utility functions
└── public/              # Static assets
```

## Design System

All design tokens are baked into:
- `tailwind.config.ts` - Colors, spacing, typography
- `src/app/globals.css` - CSS variables and utility classes

### Colors
- **Primary Dark:** `#1a1a2e`
- **Primary Light:** `#f8f7f4`
- **Accent Orange:** `#ff6b35`
- **Accent Purple:** `#7c3aed`

### Typography
- **Headlines:** Space Grotesk (bold, statement-making)
- **Body:** Inter (clean, readable)

### Animations
All animations use Framer Motion with specs from design docs:
- Scroll-triggered (decelerate easing, 500ms)
- Interactive (standard easing, 200ms)
- Auto-play (pulse loops)

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on GitHub push
# Get live URL from Vercel dashboard
```

### Environment Variables
None required for local development.

For production (Vercel), if needed:
- Create `.env.local` locally
- Add to Vercel project settings for production

## Documentation

All design and strategy docs are in the parent directory:
- `00_PROJECT_BRIEF_SUMMARY.md` - Project overview
- `01_COPY_ALL_SECTIONS.md` - All website copy
- `02_CONTENT_ARCHITECTURE.md` - Information architecture
- `03_COLOR_SYSTEM.md` - Design colors
- `04_TYPOGRAPHY_SYSTEM.md` - Type system
- `05_ANIMATION_INTERACTIONS.md` - Animation specs
- `06_FRONTEND_ARCHITECTURE.md` - Technical details
- `07_VISUAL_ASSETS_PLAN.md` - Asset sourcing
- `08_BUILD_CHECKLIST.md` - Build guide

## Development

### Hot Reload
Changes save and reload instantly in dev mode.

### Build Performance
- Page load: ~121 kB (excellent)
- Build time: ~10 seconds
- Target: < 150 kB first load JS

### TypeScript
All code is typed. Run type check:
```bash
npx tsc --noEmit
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm start` - Run production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+

## Performance

Built for speed:
- Next.js optimizations enabled
- Image optimization (WebP, AVIF)
- Code splitting
- Lazy loading
- CSS optimization via TailwindCSS

Target metrics:
- First Load JS: < 150 kB
- LCP: < 2.5s
- CLS: < 0.1
- FID: < 100ms

## License

Private project for Creative Profit.

---

**Ready to build.** Questions? Check the docs in the parent directory.
