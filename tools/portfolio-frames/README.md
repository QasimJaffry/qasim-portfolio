# Portfolio Frames

Agent-friendly mockup generator using [Frames](https://github.com/bunlongheng/frames) device assets.

## Generate

```bash
cd tools/portfolio-frames
npm install   # once
node frame.mjs
node frame.mjs agenticly decidr
```

## Layouts

| Layout | Use |
|--------|-----|
| `single` | One phone or one laptop |
| `duo` / `trio` | Same-device multi-screen |
| `combo-stage` | Laptop back-center, phone front-right |
| `combo-overlap-right` | Laptop left, phone overlapping right |
| `combo-overlap-left` | Phone left front, laptop right |
| `combo-split` | Side-by-side with light overlap |

Combo plates use `devices: [{ device, shot }, ...]` (one `macbook` + one `iphone`). Edit `manifest.json` for shots, backgrounds (`mist`, `porcelain`, `sand`, `fog`, `sky`, `slate`, `ink`, `dusk`), and layouts.

Screenshots: `.tmp-monkr-shots/<slug>/` → `public/images/projects/<slug>/`.
