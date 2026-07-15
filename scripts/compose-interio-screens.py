#!/usr/bin/env python3
"""Compose polished Interio mobile screenshots for portfolio mockups."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SPACES = Path.home() / "Desktop" / "Interior" / "assets" / "images" / "spaces"
CAT = Path.home() / "Desktop" / "Interior" / "assets" / "images" / "catalogue"
DEMO = Path.home() / "Desktop" / "Interior" / "assets" / "images" / "demo"
OUT = Path.home() / "Desktop" / "Screenshots" / "Interio"

W, H = 1080, 2340
SAFE_TOP = 92
TAB_H = 168
SAGE = (139, 152, 120)
SAGE_DEEP = (90, 100, 81)
INK = (14, 16, 32)
MUTED = (136, 144, 176)
SECONDARY = (74, 82, 112)
BORDER = (216, 220, 237)
SURFACE = (238, 240, 248)
BG = (255, 255, 255)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf"
    )
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)


def font_display(size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", size)
    except OSError:
        return font(size, bold=True)


def cover(path: Path, size: tuple[int, int], bias: float = 0.5) -> Image.Image:
    im = Image.open(path).convert("RGB")
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, int((nw - tw) * bias))
    top = max(0, int((nh - th) * 0.35))
    return im.crop((left, top, left + tw, top + th))


def rounded(im: Image.Image, radius: int) -> Image.Image:
    im = im.convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width, im.height), radius, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0))
    out.putalpha(mask)
    return out


def paste_rounded(base: Image.Image, im: Image.Image, xy: tuple[int, int], radius: int) -> None:
    base.paste(rounded(im, radius), xy, rounded(im, radius))


def status_bar(draw: ImageDraw.ImageDraw, light: bool = True) -> None:
    color = WHITE if not light else INK
    draw.text((48, 42), "9:41", font=font(28, True), fill=color)
    # signal / wifi / battery glyphs as simple shapes
    x = W - 48
    draw.rounded_rectangle((x - 54, 48, x, 70), 4, outline=color, width=2)
    draw.rectangle((x - 10, 54, x - 4, 64), fill=color)
    draw.ellipse((x - 78, 50, x - 62, 66), outline=color, width=2)
    draw.polygon([(x - 108, 66), (x - 96, 48), (x - 84, 66)], fill=color)


def tab_bar(base: Image.Image, active: str) -> None:
    y0 = H - TAB_H
    bar = Image.new("RGBA", (W, TAB_H), (255, 255, 255, 250))
    draw = ImageDraw.Draw(bar)
    draw.line((0, 0, W, 0), fill=BORDER, width=2)

    tabs = [
        ("Home", 120),
        ("Saved", 340),
        ("AR", 740),
        ("Profile", 960),
    ]
    for label, cx in tabs:
        on = label == active
        color = SAGE_DEEP if on else MUTED
        if on:
            draw.ellipse((cx - 4, 28, cx + 4, 36), fill=SAGE)
        draw.text((cx, 48), label, font=font(22, on), fill=color, anchor="mt")

    # center camera FAB
    fab = Image.new("RGBA", (112, 112), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fab)
    fd.ellipse((0, 0, 111, 111), fill=INK)
    fd.rounded_rectangle((34, 38, 78, 72), 10, outline=WHITE, width=3)
    fd.ellipse((48, 48, 64, 64), outline=WHITE, width=2)
    bar.paste(fab, ((W - 112) // 2, 18), fab)
    base.paste(bar, (0, y0), bar)


def draw_chip(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, active: bool) -> int:
    f = font(24, active)
    pad_x, pad_y = 28, 16
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    w, h = tw + pad_x * 2, th + pad_y * 2
    x, y = xy
    if active:
        draw.rounded_rectangle((x, y, x + w, y + h), 999, fill=(232, 236, 224), outline=SAGE_DEEP, width=2)
        draw.text((x + pad_x, y + pad_y - 2), text, font=f, fill=SAGE_DEEP)
    else:
        draw.rounded_rectangle((x, y, x + w, y + h), 999, fill=WHITE, outline=BORDER, width=2)
        draw.text((x + pad_x, y + pad_y - 2), text, font=f, fill=SECONDARY)
    return w + 14


def card_meta(im: Image.Image, style: str, label: str) -> Image.Image:
    out = im.convert("RGBA")
    overlay = Image.new("RGBA", out.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    h = int(out.height * 0.42)
    for i in range(h):
        a = int(160 * (i / h))
        od.line((0, out.height - h + i, out.width, out.height - h + i), fill=(8, 11, 20, a))
    out = Image.alpha_composite(out, overlay)
    d = ImageDraw.Draw(out)
    d.text((22, out.height - 78), style.upper(), font=font(18, True), fill=(255, 255, 255, 190))
    d.text((22, out.height - 52), label, font=font(26, True), fill=WHITE)
    return out


def make_home() -> Image.Image:
    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)
    status_bar(draw)
    draw.text((48, SAFE_TOP + 24), "Home", font=font_display(64), fill=INK)

    # search
    sy = SAFE_TOP + 110
    draw.rounded_rectangle((48, sy, W - 48, sy + 72), 36, fill=SURFACE)
    draw.text((88, sy + 22), "Search spaces, style, or room…", font=font(26), fill=MUTED)

    y = sy + 110
    draw.text((48, y), "CURATED", font=font(18, True), fill=MUTED)
    draw.text((48, y + 28), "Inspiration", font=font_display(44), fill=INK)
    draw.text((W - 48, y + 40), "4 spaces", font=font(22), fill=MUTED, anchor="rm")

    y += 100
    x = 48
    for i, label in enumerate(["All", "Living", "Bedroom", "Kitchen"]):
        x += draw_chip(draw, (x, y), label, active=i == 0)

    # hero — rattan nook (distinct from detection/AR rooms)
    y += 90
    hero = cover(SPACES / "rattan-window-nook.jpg", (W - 96, 520), bias=0.45)
    hero = card_meta(hero, "Cozy", "Rattan window nook")
    hd = ImageDraw.Draw(hero)
    hd.rounded_rectangle((20, 20, 150, 58), 999, fill=SAGE)
    hd.ellipse((34, 34, 46, 46), fill=WHITE)
    hd.text((56, 28), "Featured", font=font(20, True), fill=WHITE)
    paste_rounded(canvas, hero.convert("RGB"), (48, y), 28)

    y += 540
    gap = 20
    cw = (W - 96 - gap) // 2
    ch = 340
    grid = [
        (SPACES / "mustard-boho-living.jpg", "Boho", "Mustard layered living", 0.5),
        (SPACES / "modern-velvet-living.jpg", "Modern", "Velvet lounge", 0.55),
        (SPACES / "mustard-tapestry-living.jpg", "Boho", "Statement tapestry", 0.5),
        (SPACES / "modern-velvet-living.jpg", "Modern", "Metal table lounge", 0.12),
    ]
    for i, (path, style, label, bias) in enumerate(grid):
        col, row = i % 2, i // 2
        tile = cover(path, (cw, ch), bias=bias)
        tile = card_meta(tile, style, label).convert("RGB")
        paste_rounded(canvas, tile, (48 + col * (cw + gap), y + row * (ch + gap)), 20)

    tab_bar(canvas, "Home")
    return canvas


def draw_brackets(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color=SAGE, t: int = 8, arm: int = 48) -> None:
    x1, y1, x2, y2 = box
    for ax, ay, dx, dy in (
        (x1, y1, 1, 1),
        (x2, y1, -1, 1),
        (x1, y2, 1, -1),
        (x2, y2, -1, -1),
    ):
        draw.line((ax, ay, ax + dx * arm, ay), fill=color, width=t)
        draw.line((ax, ay, ax, ay + dy * arm), fill=color, width=t)


def make_detection() -> Image.Image:
    # Mustard living — sofa is the clear focal target
    room = cover(SPACES / "mustard-boho-living.jpg", (W, H - TAB_H), bias=0.5)
    canvas = Image.new("RGB", (W, H), BG)
    canvas.paste(room, (0, 0))
    draw = ImageDraw.Draw(canvas)
    status_bar(draw, light=False)

    pill = "sofa  ·  94% confidence"
    f = font(26, True)
    bbox = draw.textbbox((0, 0), pill, font=f)
    pw = bbox[2] - bbox[0] + 56
    px = (W - pw) // 2
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle((px, SAFE_TOP + 20, px + pw, SAFE_TOP + 78), 999, fill=(14, 16, 32, 200))
    od.text((W // 2, SAFE_TOP + 49), pill, font=f, fill=WHITE, anchor="mm")
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    box = (140, 520, 940, 1120)
    draw_brackets(draw, box)
    draw.rounded_rectangle((box[0], box[1] - 52, box[0] + 210, box[1] - 8), 999, fill=SAGE)
    draw.text((box[0] + 24, box[1] - 44), "Sofa · 94%", font=font(24, True), fill=WHITE)

    draw.text((W // 2, H - TAB_H - 190), "Frame furniture and tap to scan", font=font(28), fill=WHITE, anchor="mm")
    cx, cy = W // 2, H - TAB_H - 100
    draw.ellipse((cx - 52, cy - 52, cx + 52, cy + 52), outline=WHITE, width=6)
    draw.ellipse((cx - 40, cy - 40, cx + 40, cy + 40), fill=SAGE)

    tab_bar(canvas, "")
    return canvas


def make_recommendations() -> Image.Image:
    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)
    status_bar(draw)

    draw.ellipse((40, SAFE_TOP + 16, 104, SAFE_TOP + 80), fill=SURFACE)
    draw.polygon([(78, 40 + SAFE_TOP), (58, 48 + SAFE_TOP), (78, 56 + SAFE_TOP)], fill=INK)

    y = SAFE_TOP + 100
    draw.text((48, y), "SCAN RESULT", font=font(18, True), fill=MUTED)
    draw.text((48, y + 36), "Lay out a living area\naround your sofa", font=font_display(52), fill=INK)

    y += 180
    x = 48
    x += draw_chip(draw, (x, y), "●  sofa · 94%", active=True)
    draw_chip(draw, (x, y), "chair", active=False)

    y += 90
    tip = "The sofa is usually the largest piece—build the rest of the room from its placement."
    words = tip.split()
    lines, cur = [], ""
    for word in words:
        test = f"{cur} {word}".strip()
        if draw.textbbox((0, 0), test, font=font(26))[2] > W - 96:
            lines.append(cur)
            cur = word
        else:
            cur = test
    lines.append(cur)
    for i, line in enumerate(lines):
        draw.text((48, y + i * 34), line, font=font(26), fill=SECONDARY)

    y += 130
    draw.text((48, y), "Interior inspiration", font=font(32, True), fill=INK)
    y += 56
    inspo = [
        (SPACES / "mustard-tapestry-living.jpg", 0.5),
        (SPACES / "rattan-window-nook.jpg", 0.45),
        (SPACES / "modern-velvet-living.jpg", 0.5),
    ]
    iw, ih = 420, 300
    x = 48
    for path, bias in inspo:
        tile = cover(path, (iw, ih), bias=bias)
        paste_rounded(canvas, tile, (x, y), 22)
        hd = ImageDraw.Draw(canvas)
        hd.ellipse((x + iw - 70, y + 18, x + iw - 22, y + 66), fill=WHITE)
        hd.text((x + iw - 46, y + 28), "♥", font=font(28), fill=(220, 70, 70), anchor="mt")
        x += iw + 18

    y += ih + 48
    draw.text((48, y), "Suggested pieces", font=font(32, True), fill=INK)
    y += 56
    products = [
        (CAT / "sofa-3seat.jpg", "SOFA", "Three-seat sofa"),
        (CAT / "chair-accent.jpg", "CHAIR", "Accent lounge chair"),
        (CAT / "table.jpg", "TABLE", "Coffee table"),
        (CAT / "sofa-2seat.png", "SOFA", "Two-seat sofa"),
    ]
    gap = 18
    cw = (W - 96 - gap) // 2
    ch = 280
    for i, (path, kind, name) in enumerate(products):
        col, row = i % 2, i // 2
        px = 48 + col * (cw + gap)
        py = y + row * (ch + gap)
        tile = cover(path, (cw, ch), bias=0.5)
        td = ImageDraw.Draw(tile)
        td.rectangle((0, ch - 78, cw, ch), fill=(14, 16, 32))
        td.text((18, ch - 68), kind, font=font(16, True), fill=MUTED)
        td.text((18, ch - 44), name, font=font(24, True), fill=WHITE)
        paste_rounded(canvas, tile, (px, py), 18)

    return canvas


def make_ar() -> Image.Image:
    # Velvet living — 3D sofa placed in-frame (distinct from Home hero + Detection)
    room = cover(SPACES / "modern-velvet-living.jpg", (W, H - TAB_H - 220), bias=0.42)
    canvas = Image.new("RGB", (W, H), BG)
    canvas.paste(room, (0, 0))

    sofa = Image.open(DEMO / "sofa-cut.png").convert("RGBA")
    sw = 680
    sh = int(sofa.height * (sw / sofa.width))
    sofa = sofa.resize((sw, sh), Image.Resampling.LANCZOS)
    shadow = Image.new("RGBA", (sw + 40, 50), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((10, 0, sw + 30, 48), fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    sx = (W - sw) // 2 - 20
    sy = room.height - sh - 20
    layer = canvas.convert("RGBA")
    layer.paste(shadow, (sx - 20, sy + sh - 28), shadow)
    layer.paste(sofa, (sx, sy), sofa)
    canvas = layer.convert("RGB")
    draw = ImageDraw.Draw(canvas)
    status_bar(draw, light=False)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    msg = 'Tap anywhere to place “Three-seat sofa”'
    f = font(26, True)
    bw = draw.textbbox((0, 0), msg, font=f)[2] + 48
    bx = (W - bw) // 2
    od.rounded_rectangle((bx, SAFE_TOP + 18, bx + bw, SAFE_TOP + 78), 20, fill=(14, 16, 32, 200))
    od.text((W // 2, SAFE_TOP + 48), msg, font=f, fill=WHITE, anchor="mm")
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    sheet_y = H - TAB_H - 220
    draw.rectangle((0, sheet_y, W, H - TAB_H), fill=WHITE)
    draw.text((48, sheet_y + 28), "Three-seat sofa", font=font(34, True), fill=INK)

    thumbs = [
        (CAT / "sofa-3seat.jpg", True),
        (CAT / "chair-accent.jpg", False),
        (CAT / "table.jpg", False),
        (CAT / "bed.jpg", False),
    ]
    tx = 48
    ty = sheet_y + 88
    for path, on in thumbs:
        if not path.exists():
            continue
        th = cover(path, (120, 120), 0.5)
        paste_rounded(canvas, th, (tx, ty), 16)
        if on:
            ImageDraw.Draw(canvas).rounded_rectangle((tx - 3, ty - 3, tx + 123, ty + 123), 18, outline=SAGE, width=4)
        tx += 140

    tab_bar(canvas, "AR")
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    shots = {
        "01-home.png": make_home(),
        "04-camera-detected.png": make_detection(),
        "05-post-scan.png": make_recommendations(),
        "06-ar.png": make_ar(),
    }
    for name, im in shots.items():
        path = OUT / name
        im.save(path, "PNG", optimize=True)
        print(f"→ {path} ({im.size[0]}×{im.size[1]})")


if __name__ == "__main__":
    main()
