# Redesign plan — "Device Stage"

Branch: `redesign/device-stage`

## Why

Feedback: the site is tidy but "meh, not creative". Diagnosis from the current build:

- Soft grey-green palette, mid-size type, every section is the same weight and layout.
- Text-only hero, no person visible, no single strong idea.
- Mid-page (hire scopes, process, testimonials, FAQ) is four similar text blocks in a row.
- The best asset (device mockups of real shipped apps) is only used as a thumbnail.

Reference patterns (Framer Marketplace, Dribbble dev-portfolio shots): one strong colour + one giant type moment, a visible person, laptop + phone with real screens in the hero, and a metaphor (editor / terminal) rather than generic cards.

## Concept

**Dark stage, one hot accent, real devices.** The page is a dark stage. The proof of work (phone + laptop frames of live apps) is the visual, and the type is big and confident.

- Palette: near-black `#0b0c0e` background, off-white text, one hot accent (see open questions). Light-mode is out of scope.
- Type: keep Geist Sans / Mono. Drop Fraunces from the hero; use a heavy, tight sans for display (Geist at 700–800, negative tracking) with mono for labels and code-editor touches.
- Motion: one signature moment (hero devices), otherwise restrained. Respect `prefers-reduced-motion`.

## Sections (home)

1. **Hero** — giant "Qasim Hassan" left, title line, availability pill (`● Open to work · Lahore`) and two CTAs. Right: laptop + phone composition using existing project screens, slight parallax on pointer. Portrait cutout if supplied.
2. **Proof strip** — a single line of numbers (6+ yrs, 60+ shipped, 10K+ installs, 100% JSS) as a marquee or mono ticker. Replaces the stats column and the availability strip.
3. **Work index** — alternating full-width rows. Each row: big device frame, project name in huge type, one-line outcome, stack tags, store badges (Play / App Store / Live). Sticky project counter (`01 / 05`). Hover: frame tilts, accent underline.
4. **How I work + Hire scopes** — merge into one "What I take on" section: a two-column list with numbered mono labels. Drop the six-card grid and the four-step process block; fold the steps into a single horizontal timeline.
5. **Testimonials** — one large rotating quote instead of three small cards.
6. **Stack** — compact tag cloud grouped by row, mono, no table.
7. **FAQ** — keep but restyle as accordion, 3 items.
8. **Contact** — full-bleed accent block, big email, one CTA.

`/work`, `/work/[slug]`, `/about`, `/resume` inherit the new tokens and get a restyle pass after the home page lands. Resume print view must stay light/print-friendly.

## Phases

| # | Phase | Files | Done when |
|---|-------|-------|-----------|
| 0 | Fix local build on Windows (optional deps for win32 lightningcss / oxide) | `package.json`, lockfile | `npm run dev` works on Windows without manual installs |
| 1 | Design tokens: dark palette, accent, type scale, remove noise overlay and Fraunces from hero | `app/globals.css`, `app/layout.tsx` | Site renders dark with no broken contrast |
| 2 | Hero + proof strip | `components/Hero.tsx`, `Stats.tsx`, `AvailabilityStrip.tsx` | Hero screenshot reviewed at 1440 and 390 wide |
| 3 | Work index rows + device frame component | `FeaturedProjects.tsx`, `ProjectCard.tsx`, new `DeviceFrame.tsx`, `lib/data/projects.ts` | Five featured projects render with frames, badges and links |
| 4 | Merge hire scopes + process; restyle testimonials, stack, FAQ | `HireScopes.tsx`, `ProcessSection.tsx`, `Testimonials.tsx`, `SkillsGrid.tsx`, `FaqSection.tsx` | Home page has visibly varied rhythm |
| 5 | Contact + footer + nav | `ContactSection.tsx`, `Footer.tsx`, `Nav.tsx` | Nav readable over dark, mobile menu works |
| 6 | Inner pages restyle | `app/work/*`, `CaseStudyLayout.tsx`, `app/about`, `app/resume` | No page left in the old palette |
| 7 | QA | — | See checklist below |

Each phase is a separate commit so any one can be reverted.

## Assets needed

- **Portrait or cutout** of Qasim (optional but strongly recommended). Placeholder shape until supplied.
- **Real app screens** per featured project. Existing `hero.jpg` files are composed mockups; for live frames we need raw screenshots. Check `scripts/` and `tools/portfolio-frames` for the originals before asking. Fallback: crop from existing heroes.
- **Store badge links** per project (already in `lib/data/projects.ts` in some form; verify).

## QA checklist

- Playwright screenshots at 1440, 768 and 390 for `/`, `/work`, one case study, `/about`, `/resume`.
- No console errors; no horizontal scroll at 390.
- Contrast: body text and accent-on-dark meet WCAG AA.
- `prefers-reduced-motion` disables the parallax and marquee.
- `npm run lint` and `npm run build` (static export, with and without `GITHUB_PAGES=true`) pass.
- Lighthouse performance not worse than current; hero images sized and lazy where below the fold.
- OG image regenerated to match the new look.

## Risks

- Dark + hot accent can look like every other dev template if the type isn't big and the copy isn't specific. Mitigation: big type, real numbers, real store links, and rewrite generic copy ("AI-native", "real users") in a plainer voice.
- Device frames built from flat JPGs may look pasted-on. Mitigation: build `DeviceFrame` in CSS/SVG around raw screenshots, not around already-composed mockups.
- Scope creep into inner pages. Mitigation: home page first, review, then phase 6.

## Open questions

1. Accent colour: acid green `#c6ff3d`, signal orange `#ff5a1f`, or electric blue `#3d5afe`? (Default: orange.)
2. Portrait: available or use placeholder?
3. Keep light mode as an option, or dark only? (Default: dark only.)
4. Which five projects are featured? (Default: Agenticly, Innerverse, BugMapper, SafeDeal, Qubio.)
