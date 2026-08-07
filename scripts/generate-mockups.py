#!/usr/bin/env python3
"""Compose portfolio mockups from Desktop/Screenshots into public/images/projects."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SHOTS = Path.home() / "Desktop" / "Screenshots"
OUT = ROOT / "public" / "images" / "projects"

BG = (247, 245, 239)
SURFACE = (236, 230, 216)
ACCENT = (15, 138, 124)

FONT_REG = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
FONT_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REG), size)


def cover_box(
    im: Image.Image,
    box: tuple[int, int, int, int],
    fill: tuple[int, ...] | None = None,
) -> Image.Image:
    """Paint over a rectangle (sample nearby pixels when fill is omitted)."""
    im = ensure_rgba(im).copy()
    x0, y0, x1, y1 = box
    if fill is None:
        sx0, sx1 = max(0, x0), min(im.width, x1)
        sy0 = max(0, y0 - 4)
        sy1 = max(sy0 + 1, min(im.height, y0))
        sample = np.asarray(im.crop((sx0, sy0, sx1, sy1)).convert("RGB"))
        fill = tuple(int(v) for v in np.median(sample.reshape(-1, 3), axis=0)) + (255,)
    elif len(fill) == 3:
        fill = (*fill, 255)
    ImageDraw.Draw(im).rectangle((x0, y0, x1 - 1, y1 - 1), fill=fill)
    return im


def write_text(
    im: Image.Image,
    xy: tuple[int, int],
    text: str,
    size: int,
    *,
    bold: bool = False,
    fill: tuple[int, int, int] = (22, 22, 22),
    line_gap: int = 3,
    center_in: tuple[int, int, int, int] | None = None,
) -> Image.Image:
    """Draw single- or multi-line text; optional center_in box for alignment."""
    im = ensure_rgba(im).copy()
    font = load_font(size, bold=bold)
    draw = ImageDraw.Draw(im)
    lines = text.split("\n")
    heights = []
    widths = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        widths.append(bbox[2] - bbox[0])
        heights.append(bbox[3] - bbox[1])
    block_h = sum(heights) + line_gap * (len(lines) - 1)
    if center_in is not None:
        cx0, cy0, cx1, cy1 = center_in
        x = cx0 + (cx1 - cx0 - max(widths, default=0)) // 2
        y = cy0 + (cy1 - cy0 - block_h) // 2
    else:
        x, y = xy
    for line, lh, lw in zip(lines, heights, widths):
        lx = x
        if center_in is not None:
            lx = center_in[0] + (center_in[2] - center_in[0] - lw) // 2
        draw.text((lx, y), line, font=font, fill=fill)
        y += lh + line_gap
    return im


def patch_stp_topics(im: Image.Image) -> Image.Image:
    """Wipe misspelled 'Choose Tppic' by cloning neighboring mist pixels row-by-row."""
    im = ensure_rgba(im).copy()
    arr = np.asarray(im).copy()
    x0, y0, x1, y1 = 65, 278, 315, 324
    # Sample from just left of the typo (outside text) and flood each row
    for y in range(y0, y1):
        sample = arr[y, max(0, x0 - 12) : x0]
        if sample.size == 0:
            continue
        fill = np.median(sample.reshape(-1, sample.shape[-1]), axis=0)
        arr[y, x0:x1] = fill
    return Image.fromarray(arr)


def patch_stp_game(im: Image.Image) -> Image.Image:
    # Full button face (~y710–765) so original "Lets Start" cannot peek through
    btn = (88, 712, 288, 762)
    im = cover_box(im, btn, fill=(158, 172, 228))
    return write_text(
        im,
        (0, 0),
        "Let's Start",
        17,
        bold=True,
        fill=(255, 255, 255),
        center_in=btn,
    )


def patch_cpas_home(im: Image.Image) -> Image.Image:
    # Truncated featured / liked room titles → short names that fit the cards
    west = (198, 282, 358, 308)
    im = cover_box(im, west, fill=(255, 255, 255))
    im = write_text(im, (0, 0), "Westside FC", 13, bold=True, center_in=west)
    # Original title extends to ~x191 ("…Clu")
    coast = (16, 688, 205, 710)
    im = cover_box(im, coast, fill=(255, 255, 255))
    return write_text(
        im, (0, 0), "Coastal Rugby", 12, bold=True, center_in=coast
    )


# Dark studio plate — used for AI projects
STUDIO_BG = (18, 20, 23)
STUDIO_MID = (28, 32, 36)
STUDIO_RIM = (48, 56, 62)
STUDIO_BLACK = (5, 5, 7)
STUDIO_MID_BLACK = (10, 10, 12)
# Elevated screen-card chassis — slightly lifted from studio black / app UI
SCREEN_CARD_FRAME = (24, 26, 32)
SCREEN_CARD_RIM = (88, 96, 112, 72)

# Real Pixel 7 Pro bezel (from Monkr) — screenshot sits in the transparent hole
PIXEL_FRAME = ROOT / "scripts" / "assets" / "devices" / "pixel-7-pro-obsidian.png"
# Measured hole in pixel-7-pro-obsidian.png (600×1301)
PIXEL_SCREEN = (60, 169, 540, 1170)  # left, top, right, bottom → 480×1001


def ensure_rgba(im: Image.Image) -> Image.Image:
    return im.convert("RGBA") if im.mode != "RGBA" else im


def fill_baked_round_corners(im: Image.Image) -> Image.Image:
    """Fill transparent / near-black baked corner rounding so the dark phone shell
    cannot tint through as black triangles at the screen corners.
    """
    im = ensure_rgba(im).copy()
    arr = np.asarray(im).copy()
    h, w = arr.shape[:2]
    # Interior sample — avoid edges that may already be black
    y0, y1 = int(h * 0.18), int(h * 0.42)
    x0, x1 = int(w * 0.18), int(w * 0.82)
    sample = arr[y0:y1, x0:x1].reshape(-1, 4)
    if sample.size == 0:
        fill = np.array([255, 255, 255, 255], dtype=arr.dtype)
    else:
        fill = np.median(sample, axis=0).astype(arr.dtype)
    # Also prefer top-edge mid (status bar) when light
    top_mid = arr[2 : max(3, int(h * 0.04)), int(w * 0.3) : int(w * 0.7)]
    if top_mid.size and float(np.median(top_mid[:, :, :3])) > 200:
        fill = np.median(top_mid.reshape(-1, 4), axis=0).astype(arr.dtype)

    corner = max(28, int(min(w, h) * 0.09))
    boxes = (
        (0, corner, 0, corner),
        (0, corner, w - corner, w),
        (h - corner, h, 0, corner),
        (h - corner, h, w - corner, w),
    )
    for ys, ye, xs, xe in boxes:
        region = arr[ys:ye, xs:xe]
        lum = region[:, :, :3].astype(np.float32).max(axis=2)
        alpha = region[:, :, 3]
        # Any near-black / see-through pixel in the corner pad (baked round leftovers)
        mask = (lum < 70) | (alpha < 230)
        if mask.any():
            region[mask] = fill
            arr[ys:ye, xs:xe] = region
    out = Image.fromarray(arr)
    # Preserve metadata
    out.info.update(im.info)
    return out


def clean_status_bar_notifications(
    screenshot: Image.Image, bar_h: int | None = None
) -> Image.Image:
    """Wipe Android status-bar app notification icons; keep time + system cluster.

    bar_h must stay proportional — a hard 88px floor on ~812px iOS shots painted a
    giant white band over the header (the portfolio "weird white bar").
    """
    im = ensure_rgba(screenshot).copy()
    w, h = im.size
    if bar_h is None:
        # ~3.5–4.5% of height; clamp for tiny/huge captures only
        bar_h = max(26, min(72, int(h * 0.042)))
    # Sample clean bar fill from under the clock / left padding
    sample = im.crop((4, 4, min(60, w // 10), min(bar_h - 6, max(12, bar_h - 4))))
    pixels = list(sample.getdata())
    if not pixels:
        return im
    r = sum(p[0] for p in pixels) // len(pixels)
    g = sum(p[1] for p in pixels) // len(pixels)
    b = sum(p[2] for p in pixels) // len(pixels)
    a = sum(p[3] for p in pixels) // len(pixels)
    # Wipe from just after clock through almost the system icon cluster
    left = int(w * 0.12)
    right = int(w * 0.78)

    # Only wipe a real status bar. Web/app captures that start with their own
    # header have content crossing the band, and blanking it slices the title in
    # half (the "Cat Chat" / "RealTag" struck-through headers). Status-bar icons
    # sit entirely inside the band, so nothing crosses its lower edge.
    if bar_h + 3 < h:
        rgb = im.convert("RGB")
        above_y, below_y = max(0, bar_h - 3), min(h - 1, bar_h + 3)
        crossing = 0
        for x in range(left, right, max(1, (right - left) // 120)):
            above = rgb.getpixel((x, above_y))
            below = rgb.getpixel((x, below_y))
            if (
                max(abs(above[i] - (r, g, b)[i]) for i in range(3)) > 28
                and max(abs(below[i] - (r, g, b)[i]) for i in range(3)) > 28
            ):
                crossing += 1
        if crossing > 3:
            return im

    ImageDraw.Draw(im).rectangle((left, 0, right, bar_h), fill=(r, g, b, a))
    return im


def trim_web_top_padding(screenshot: Image.Image, max_frac: float = 0.12) -> Image.Image:
    """Crop empty white padding above the first real UI row on web captures.

    Samples the center band so rounded-card edge antialias doesn't block detection.
    """
    im = ensure_rgba(screenshot)
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w = arr.shape[:2]
    x0, x1 = int(w * 0.2), int(w * 0.8)
    center = arr[:, x0:x1]
    stds = center.std(axis=(1, 2))
    means = center.mean(axis=(1, 2))
    crop = 0
    limit = min(h - 8, int(h * max_frac))
    for y in range(0, limit):
        if means[y] > 248 and stds[y] < 10:
            crop = y + 1
            continue
        if stds[y] > 18 or means[y] < 245:
            break
    crop = max(0, crop - 2)
    if crop < 8:
        return im
    return im.crop((0, crop, w, h))


def detect_ios_chrome_height(screenshot: Image.Image) -> int:
    """Bottom of status bar + empty safe-area, so UI sits under the Dynamic Island."""
    arr = np.asarray(screenshot.convert("RGB")).astype(np.float32)
    h, w = arr.shape[:2]
    stds = arr.std(axis=(1, 2))
    means = arr.mean(axis=(1, 2))
    left = arr[:, : max(1, w // 5)].std(axis=(1, 2))
    right = arr[:, -max(1, w // 5) :].std(axis=(1, 2))
    edge_std = np.maximum(left, right)
    y0 = max(16, int(h * 0.02))
    y1 = min(h - 8, int(h * 0.14))
    crop = max(24, int(h * 0.04))
    quiet = 0
    for y in range(y0, y1):
        soft = means[y] > 205 and stds[y] < 34 and edge_std[y] < 38
        flat = stds[y] < 14 and edge_std[y] < 18
        if flat or soft:
            quiet += 1
            crop = y + 1
        elif quiet >= 4 and (stds[y] > 22 or edge_std[y] > 28):
            break
        elif (stds[y] > 40 or edge_std[y] > 45) and y < int(h * 0.06):
            crop = y + 1
            quiet = 0
            continue
    # Cap crop — never eat logos/headers; pad handles island clearance
    return int(np.clip(crop, int(h * 0.035), int(h * 0.08)))


def draw_ios_status_bar(
    im: Image.Image,
    pad: int,
    fill_rgb: tuple[int, int, int],
) -> Image.Image:
    """Paint time + signal/wifi/battery into the island clearance pad.

    prep_ios strips the real chrome; without this the Dynamic Island sits on empty
    color and the phone reads unfinished.
    """
    im = ensure_rgba(im).copy()
    w, _h = im.size
    if pad < 36:
        return im
    draw = ImageDraw.Draw(im)
    lum = 0.2126 * fill_rgb[0] + 0.7152 * fill_rgb[1] + 0.0722 * fill_rgb[2]
    ink = (25, 25, 28, 255) if lum > 160 else (255, 255, 255, 255)

    # Vertically center in the pad, slightly below the island midline
    cy = max(20, min(pad - 16, int(pad * 0.48)))

    # Time — SF Pro when available
    time_size = max(14, int(w * 0.038))
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", time_size)
    except OSError:
        font = load_font(time_size, bold=True)
    time_txt = "9:41"
    bbox = draw.textbbox((0, 0), time_txt, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = int(w * 0.085)
    draw.text((tx, cy - th // 2 - 1), time_txt, font=font, fill=ink)

    # ---- right cluster: cellular · wifi · battery (tight iOS spacing) ----
    s = w / 390.0  # scale relative to classic iPhone width
    right = int(w * 0.90)

    # Battery
    bw, bh = max(20, int(22 * s)), max(9, int(10 * s))
    bx = right - bw
    by = cy - bh // 2
    tip = max(2, int(2 * s))
    draw.rounded_rectangle((bx, by, bx + bw - 1, by + bh - 1), radius=2, outline=ink, width=max(1, int(1.5 * s)))
    draw.rectangle(
        (bx + bw - 1, by + max(2, bh // 4), bx + bw - 1 + tip, by + bh - max(2, bh // 4)),
        fill=ink,
    )
    inner = max(2, int(2 * s))
    fill_w = int((bw - inner * 2 - 1) * 0.78)
    draw.rounded_rectangle(
        (bx + inner, by + inner, bx + inner + fill_w, by + bh - inner - 1),
        radius=1,
        fill=ink,
    )

    # Wi‑Fi — three clean arcs + center dot
    wx = bx - int(18 * s)
    for r, width in ((int(10 * s), max(2, int(2 * s))), (int(6.5 * s), max(2, int(2 * s))), (int(3 * s), 0)):
        box = (wx - r, cy - r - int(1 * s), wx + r, cy + r - int(1 * s))
        if width:
            draw.arc(box, 210, 330, fill=ink, width=width)
        else:
            draw.ellipse((wx - 1, cy - int(2 * s) - 1, wx + 2, cy - int(2 * s) + 2), fill=ink)

    # Cellular bars
    bar_w = max(2, int(3 * s))
    gap = max(2, int(2.2 * s))
    heights = [0.40, 0.58, 0.78, 1.0]
    max_bh = max(9, int(11 * s))
    cluster_w = 4 * bar_w + 3 * gap
    sx = wx - int(16 * s) - cluster_w
    base_y = cy + max_bh // 2
    for i, frac in enumerate(heights):
        hh = max(3, int(max_bh * frac))
        x0 = sx + i * (bar_w + gap)
        draw.rounded_rectangle((x0, base_y - hh, x0 + bar_w, base_y), radius=1, fill=ink)
    return im


def prep_ios_for_frame(screenshot: Image.Image, bar_frac: float | None = None) -> Image.Image:
    """Keep the screenshot's real status bar; only pad if content would hit the island.

    Earlier we stripped chrome and redrew icons — that looked worse than the source.
    Sources already have 9:41 / signal / wifi / battery; the frame just adds the island.
    """
    del bar_frac  # retained for call-site compat; detection no longer crops the bar
    im = ensure_rgba(screenshot).copy()
    w, h = im.size
    # If the top already looks like iOS chrome (time left + icons right), keep it —
    # add a few px of matching inset so icons aren't crushed into the bezel curve.
    if _has_ios_status_bar(im):
        sample = np.asarray(im.convert("RGB").crop((0, 0, w, min(12, h))))
        fill = tuple(int(x) for x in np.median(sample.reshape(-1, 3), axis=0))
        inset = max(10, int(h * 0.016))
        out = Image.new("RGBA", (w, h + inset), (*fill, 255))
        out.paste(im, (0, inset))
        out.info["ios_pad"] = max(44, int((h + inset) * 0.055))
        out.info["ios_pad_fill"] = fill
        out.info["keep_status_bar"] = True
        return out

    # Fallback for bare UI exports with no system chrome
    bar = detect_ios_chrome_height(im)
    body = im.crop((0, bar, w, h))
    sample = np.asarray(body.convert("RGB").crop((0, 0, w, min(10, body.height))))
    fill = tuple(int(x) for x in np.median(sample.reshape(-1, 3), axis=0))
    pad = max(62, int(h * 0.082))
    out = Image.new("RGBA", (w, body.height + pad), (*fill, 255))
    out.paste(body, (0, pad))
    out.info["ios_pad"] = pad
    out.info["ios_pad_fill"] = fill
    out.info["keep_status_bar"] = False
    return out


def _has_ios_status_bar(im: Image.Image) -> bool:
    """Heuristic: ink on left (time) and right (icons) in the top ~5%."""
    arr = np.asarray(im.convert("RGB"))
    h, w = arr.shape[:2]
    y1 = max(18, int(h * 0.055))
    top = arr[:y1]
    left = top[:, int(w * 0.04) : int(w * 0.24)]
    right = top[:, int(w * 0.70) : int(w * 0.96)]
    mid = top[:, int(w * 0.35) : int(w * 0.65)]
    # Grey system chrome, not pure black
    left_dark = np.mean(np.all(left < 140, axis=2))
    right_dark = np.mean(np.all(right < 140, axis=2))
    mid_dark = np.mean(np.all(mid < 140, axis=2))
    return left_dark > 0.012 and right_dark > 0.03 and mid_dark < max(0.008, left_dark * 0.5)


def assert_island_clearance(framed: Image.Image, min_gap: int = 40) -> tuple[bool, int]:
    """Check UI starts clearly below the Dynamic Island (island ends ~y 36 on device)."""
    arr = np.asarray(framed.convert("RGB")).astype(np.float32)
    bezel = 14
    h, w = arr.shape[:2]
    # Measure outside the island horizontally
    left = arr[:, int(w * 0.06) : int(w * 0.28)].std(axis=(1, 2))
    right = arr[:, int(w * 0.72) : int(w * 0.94)].std(axis=(1, 2))
    edge = np.maximum(left, right)
    island_bottom = 38  # device coords
    for y in range(island_bottom, min(h, bezel + 180)):
        if edge[y] > 18:
            gap = y - island_bottom
            return gap >= min_gap, gap
    return False, -1


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def gradient_bg(
    size: tuple[int, int],
    tint: tuple[int, int, int] = ACCENT,
    strength: float = 0.14,
    studio: bool = False,
    studio_black: bool = False,
) -> Image.Image:
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w]

    if studio:
        base = STUDIO_BLACK if studio_black else STUDIO_BG
        mid = STUDIO_MID_BLACK if studio_black else STUDIO_MID
        arr = np.full((h, w, 3), base, dtype=np.float32)
        eff_strength = strength * (0.55 if studio_black else 1.0)
        floor = np.clip((yy / h - 0.35) / 0.65, 0, 1) ** 1.4
        for i, c in enumerate(mid):
            arr[:, :, i] = arr[:, :, i] * (1 - floor * 0.55) + c * (floor * 0.55)
        # key light from upper right
        cx, cy = w * 0.68, h * 0.18
        dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        key = np.clip(1 - dist / (max(w, h) * 0.75), 0, 1) ** 1.8
        key_mix = key * (eff_strength + 0.1)
        for i, c in enumerate(tint):
            arr[:, :, i] = arr[:, :, i] * (1 - key_mix * 0.55) + c * (key_mix * 0.55)
        # soft rim toward edges (studio cyclorama feel)
        edge = ((xx / w - 0.5) ** 2 * 1.1 + (yy / h - 0.55) ** 2) * 1.35
        edge = np.clip(edge, 0, 1)
        for i, c in enumerate(STUDIO_RIM):
            arr[:, :, i] = arr[:, :, i] * (1 - edge * 0.18) + c * (edge * 0.18)
        # faint film grain
        rng = np.random.default_rng(7)
        grain = rng.normal(0, 0.9, (h, w, 1)).astype(np.float32)
        arr = arr + grain
        return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")

    arr = np.full((h, w, 3), BG, dtype=np.float32)
    cx, cy = w * 0.72, h * 0.22
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    radial = np.clip(1 - dist / (max(w, h) * 0.9), 0, 1) ** 1.5
    wash = (yy / h) * 0.5
    mix = (radial * 0.75 + wash * 0.4) * strength
    for i, c in enumerate(tint):
        arr[:, :, i] = arr[:, :, i] * (1 - mix) + c * mix
    edge = ((xx / w - 0.5) ** 2 + (yy / h - 0.52) ** 2) * 1.2
    edge = np.clip(edge, 0, 1)
    for i, c in enumerate(SURFACE):
        arr[:, :, i] = arr[:, :, i] * (1 - edge * 0.25) + c * (edge * 0.25)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")


def ambient_blob(
    canvas: tuple[int, int],
    tint: tuple[int, int, int],
    cy_shift: int = 40,
    studio: bool = False,
) -> Image.Image:
    blob = Image.new("RGBA", canvas, (0, 0, 0, 0))
    draw = ImageDraw.Draw(blob)
    cx, cy = canvas[0] // 2, canvas[1] // 2 + cy_shift
    alpha = 48 if studio else 32
    draw.ellipse((cx - 520, cy - 300, cx + 520, cy + 340), fill=(*tint, alpha))
    if studio:
        # secondary cooler fill light from left
        draw.ellipse((cx - 620, cy - 80, cx - 40, cy + 380), fill=(60, 90, 110, 22))
    return blob.filter(ImageFilter.GaussianBlur(100 if studio else 90))


def drop_shadow(
    size: tuple[int, int],
    radius: int,
    blur: int = 40,
    opacity: int = 95,
    offset: tuple[int, int] = (0, 14),
) -> Image.Image:
    pad = blur * 3
    shadow = Image.new("RGBA", (size[0] + pad * 2, size[1] + pad * 2), (0, 0, 0, 0))
    layer = Image.new("L", size, 0)
    ImageDraw.Draw(layer).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=opacity)
    # soft black via alpha channel
    rgba = Image.new("RGBA", size, (0, 0, 0, 0))
    rgba.putalpha(layer)
    shadow.paste(rgba, (pad + offset[0], pad + offset[1]), rgba)
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def paste_with_shadow(
    canvas: Image.Image,
    device: Image.Image,
    xy: tuple[int, int],
    radius: int = 24,
    blur: int = 36,
    opacity: int = 90,
    studio: bool = False,
) -> None:
    if studio:
        blur = int(blur * 1.25)
        opacity = min(160, opacity + 40)
    shadow = drop_shadow(device.size, radius=radius, blur=blur, opacity=opacity)
    sx = xy[0] - (shadow.width - device.width) // 2
    sy = xy[1] - (shadow.height - device.height) // 2 + 8
    canvas.paste(shadow, (sx, sy), shadow)
    canvas.paste(device, xy, device)


def make_bg(
    canvas: tuple[int, int],
    tint: tuple[int, int, int],
    studio: bool,
    strength: float = 0.14,
    cy_shift: int = 40,
    studio_black: bool = False,
) -> Image.Image:
    bg = gradient_bg(canvas, tint=tint, strength=strength, studio=studio, studio_black=studio_black)
    return Image.alpha_composite(bg, ambient_blob(canvas, tint, cy_shift=cy_shift, studio=studio))


def compose_plate(
    device: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    offset_y: int = 0,
    studio: bool = False,
) -> Image.Image:
    bg = make_bg(canvas, tint, studio, strength=0.18 if studio else 0.14, cy_shift=offset_y + 30)
    dx = (canvas[0] - device.width) // 2
    dy = (canvas[1] - device.height) // 2 + offset_y
    paste_with_shadow(bg, device, (dx, dy), radius=20, studio=studio)
    return bg.convert("RGB")


def compose_dual_phones(
    left: Image.Image,
    right: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
    gap: int = 72,
    angle: float = 2.5,
    max_h: int = 820,
    margin: int = 56,
    clean_notifications: bool = True,
    status_fill: tuple[int, int, int] | None = None,
    draw_island: bool = True,
    phone_style: str = "ios",
    studio_black: bool = False,
) -> Image.Image:
    """Two angled phones — scaled from rotated bounds so nothing clips the plate."""

    def build(scale: float):
        h = max(1, int(max_h * scale))
        a = phone_frame(
            left,
            max_h=h,
            clean_notifications=clean_notifications,
            status_fill=status_fill,
            draw_island=draw_island,
            style=phone_style,
        )
        b = phone_frame(
            right,
            max_h=h,
            clean_notifications=clean_notifications,
            status_fill=status_fill,
            draw_island=draw_island,
            style=phone_style,
        )
        ra = a.rotate(-angle, resample=Image.Resampling.BICUBIC, expand=True)
        rb = b.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        g = max(24, int(gap * scale))
        total_w = ra.width + rb.width + g
        x0 = (canvas[0] - total_w) // 2
        y0 = (canvas[1] - max(ra.height, rb.height)) // 2
        return (
            ((ra, x0, y0), (rb, x0 + ra.width + g, y0 + 6)),
            total_w,
            max(ra.height, rb.height),
        )

    scale = 1.0
    placements, total_w, tall = build(scale)
    for _ in range(10):
        # Bounds of both rotated devices
        xs = [p[1] for p in placements] + [p[1] + p[0].width for p in placements]
        ys = [p[2] for p in placements] + [p[2] + p[0].height for p in placements]
        need_w = max(xs) - min(xs)
        need_h = max(ys) - min(ys)
        fit = min(
            (canvas[0] - margin * 2) / max(1, need_w),
            (canvas[1] - margin * 2) / max(1, need_h),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.97
        placements, total_w, tall = build(scale)

    # Center the pair
    xs = [p[1] for p in placements] + [p[1] + p[0].width for p in placements]
    ys = [p[2] for p in placements] + [p[2] + p[0].height for p in placements]
    shift_x = (canvas[0] - (max(xs) - min(xs))) // 2 - min(xs)
    shift_y = (canvas[1] - (max(ys) - min(ys))) // 2 - min(ys)

    bg = make_bg(
        canvas,
        tint,
        studio,
        strength=0.18 if studio else 0.14,
        studio_black=studio_black,
    )
    for device, dx, dy in placements:
        paste_with_shadow(
            bg,
            device,
            (dx + shift_x, dy + shift_y),
            radius=48,
            blur=34,
            opacity=85,
            studio=studio,
        )
    return bg.convert("RGB")


def compose_triple_phones(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
    phone_style: str = "ios",
) -> Image.Image:
    phones = [
        phone_frame(s, max_h=880 if i == 1 else 780, style=phone_style)
        for i, s in enumerate(shots[:3])
    ]
    bg = make_bg(canvas, tint, studio, strength=0.2 if studio else 0.16, cy_shift=50)

    side_gap = -36
    total_w = sum(p.width for p in phones) + side_gap * (len(phones) - 1)
    x0 = (canvas[0] - total_w) // 2
    ys = []
    xs = []
    x = x0
    for i, p in enumerate(phones):
        xs.append(x)
        ys.append((canvas[1] - p.height) // 2 + (36 if i != 1 else 8))
        x += p.width + side_gap

    angles = [-7, 0, 7]
    for i in (0, 2, 1):
        if i >= len(phones):
            continue
        device = phones[i]
        rotated = device.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
        rx = xs[i] + (device.width - rotated.width) // 2
        ry = ys[i] + (device.height - rotated.height) // 2
        paste_with_shadow(
            bg,
            rotated,
            (rx, ry),
            radius=48,
            blur=30,
            opacity=80 if i != 1 else 95,
            studio=studio,
        )
    return bg.convert("RGB")


def compose_quad_phones(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
    phone_style: str = "ios",
) -> Image.Image:
    """BSchedule-style fan, four phones — fully in-frame (no edge clip)."""
    margin = 52
    heights = [620, 700, 780, 620]
    max_ws = [330, 350, 380, 330]
    angles = [-6.5, -2.2, 2.2, 6.5]
    # Positive gap: rotation already overlaps the frames' bounding boxes, and a
    # tuck on top of that buries the screen titles on the outer phones.
    side_gap = 16
    y_nudge = [28, 12, 2, 28]

    def build(scale: float):
        phones = [
            phone_frame(
                s,
                max_h=max(1, int(heights[i] * scale)),
                max_w=max(1, int(max_ws[i] * scale)),
                style=phone_style,
            )
            for i, s in enumerate(shots[:4])
        ]
        rotated = [
            p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
            for i, p in enumerate(phones)
        ]
        gap = int(side_gap * scale) if scale < 1 else side_gap
        total_w = sum(p.width for p in phones) + gap * (len(phones) - 1)
        x0 = (canvas[0] - total_w) // 2
        xs_base, ys_base = [], []
        x = x0
        for i, p in enumerate(phones):
            xs_base.append(x)
            ys_base.append((canvas[1] - p.height) // 2 + int(y_nudge[i] * scale))
            x += p.width + gap
        # Place by rotated AABB centers over base positions
        xs, ys = [], []
        for i, p in enumerate(phones):
            xs.append(xs_base[i] + (p.width - rotated[i].width) // 2)
            ys.append(ys_base[i] + (p.height - rotated[i].height) // 2)
        return phones, rotated, xs, ys

    scale = 1.0
    phones, rotated, xs, ys = build(scale)
    for _ in range(10):
        min_x = min(xs)
        max_x = max(xs[i] + rotated[i].width for i in range(4))
        min_y = min(ys)
        max_y = max(ys[i] + rotated[i].height for i in range(4))
        fit = min(
            (canvas[0] - margin * 2) / max(1, max_x - min_x),
            (canvas[1] - margin * 2) / max(1, max_y - min_y),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.97
        phones, rotated, xs, ys = build(scale)

    # Center fan in the safe area
    min_x = min(xs)
    max_x = max(xs[i] + rotated[i].width for i in range(4))
    min_y = min(ys)
    max_y = max(ys[i] + rotated[i].height for i in range(4))
    shift_x = (canvas[0] - (max_x - min_x)) // 2 - min_x
    shift_y = (canvas[1] - (max_y - min_y)) // 2 - min_y
    xs = [x + shift_x for x in xs]
    ys = [y + shift_y for y in ys]

    bg = make_bg(canvas, tint, studio, strength=0.22 if studio else 0.15, cy_shift=40)
    for i in (0, 3, 1, 2):
        paste_with_shadow(
            bg,
            rotated[i],
            (xs[i], ys[i]),
            radius=48,
            blur=28 if i != 2 else 34,
            opacity=78 if i in (0, 3) else (90 if i == 1 else 110),
            studio=studio,
        )
    return bg.convert("RGB")


def compose_laptop_phone(
    web: Image.Image,
    mobile: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    phone_side: str = "right",
    studio: bool = False,
    web_fit: str = "width",
    phone_style: str = "ios",
    phone_max_h: int = 760,
    studio_black: bool = False,
) -> Image.Image:
    """Laptop + phone — both fully visible with safe margins."""
    margin = 48
    # Keep laptop a bit smaller so the overlapping phone never clips the plate.
    laptop = browser_in_laptop(web, screen_w=1040, fit=web_fit)
    phone = phone_frame(mobile, max_h=phone_max_h, style=phone_style)
    angle = 4 if phone_side == "right" else -4
    angled = phone.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    # Scale both down together if needed so rotated phone fits in canvas.
    max_phone_h = canvas[1] - margin * 2
    max_laptop_w = canvas[0] - margin * 2 - int(angled.width * 0.42)
    scale = 1.0
    if angled.height > max_phone_h:
        scale = min(scale, max_phone_h / angled.height)
    if laptop.width > max_laptop_w:
        scale = min(scale, max_laptop_w / laptop.width)
    if scale < 0.999:
        laptop = laptop.resize(
            (max(1, int(laptop.width * scale)), max(1, int(laptop.height * scale))),
            Image.Resampling.LANCZOS,
        )
        phone = phone_frame(mobile, max_h=int(phone_max_h * scale), style=phone_style)
        angled = phone.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    bg = make_bg(
        canvas, tint, studio, strength=0.2 if studio else 0.15, cy_shift=60, studio_black=studio_black
    )

    # Laptop left-biased; phone sits beside it with light overlap, fully in-frame.
    if phone_side == "right":
        lx = margin + 20
        ly = (canvas[1] - laptop.height) // 2 - 12
        ax = lx + laptop.width - int(angled.width * 0.38)
        ay = (canvas[1] - angled.height) // 2 + 28
    else:
        lx = canvas[0] - laptop.width - margin - 20
        ly = (canvas[1] - laptop.height) // 2 - 12
        ax = lx - int(angled.width * 0.55)
        ay = (canvas[1] - angled.height) // 2 + 28

    ax = max(margin, min(ax, canvas[0] - angled.width - margin))
    ay = max(margin, min(ay, canvas[1] - angled.height - margin))
    lx = max(margin // 2, min(lx, canvas[0] - laptop.width - margin // 2))
    ly = max(margin // 2, min(ly, canvas[1] - laptop.height - margin // 2))

    paste_with_shadow(bg, laptop, (lx, ly), radius=16, blur=42, opacity=100, studio=studio)
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=34, opacity=100, studio=studio)
    return bg.convert("RGB")


def compose_laptop_flanked(
    web: Image.Image,
    left_mobile: Image.Image,
    right_mobile: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
    web_fit: str = "width",
    phone_style: str = "ios",
    phone_max_h: int = 720,
    studio_black: bool = False,
) -> Image.Image:
    """Phone left + laptop center + phone right — classic product triad."""
    margin = 36
    angle = 3.2

    def build(scale: float):
        laptop = browser_in_laptop(web, screen_w=max(1, int(980 * scale)), fit=web_fit)
        left = phone_frame(
            left_mobile, max_h=max(1, int(phone_max_h * scale)), style=phone_style
        )
        right = phone_frame(
            right_mobile, max_h=max(1, int(phone_max_h * scale)), style=phone_style
        )
        rl = left.rotate(-angle, resample=Image.Resampling.BICUBIC, expand=True)
        rr = right.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        # Phones tuck slightly under laptop edges so the set reads as one cluster
        overlap = int(min(rl.width, rr.width) * 0.28)
        total_w = rl.width + laptop.width + rr.width - overlap * 2
        x0 = (canvas[0] - total_w) // 2
        ly = (canvas[1] - laptop.height) // 2 - 8
        lx = x0 + rl.width - overlap
        left_x = x0
        left_y = (canvas[1] - rl.height) // 2 + 36
        right_x = lx + laptop.width - overlap
        right_y = (canvas[1] - rr.height) // 2 + 36
        return (
            (laptop, lx, ly),
            (rl, left_x, left_y),
            (rr, right_x, right_y),
        )

    scale = 1.0
    laptop_p, left_p, right_p = build(scale)
    for _ in range(12):
        devices = (laptop_p, left_p, right_p)
        xs = [p[1] for p in devices] + [p[1] + p[0].width for p in devices]
        ys = [p[2] for p in devices] + [p[2] + p[0].height for p in devices]
        fit = min(
            (canvas[0] - margin * 2) / max(1, max(xs) - min(xs)),
            (canvas[1] - margin * 2) / max(1, max(ys) - min(ys)),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.97
        laptop_p, left_p, right_p = build(scale)

    devices = (laptop_p, left_p, right_p)
    xs = [p[1] for p in devices] + [p[1] + p[0].width for p in devices]
    ys = [p[2] for p in devices] + [p[2] + p[0].height for p in devices]
    shift_x = (canvas[0] - (max(xs) - min(xs))) // 2 - min(xs)
    shift_y = (canvas[1] - (max(ys) - min(ys))) // 2 - min(ys)

    bg = make_bg(
        canvas,
        tint,
        studio,
        strength=0.2 if studio else 0.15,
        cy_shift=50,
        studio_black=studio_black,
    )
    # Laptop first (behind), phones on top at the flanks
    for device, dx, dy in (laptop_p, left_p, right_p):
        paste_with_shadow(
            bg,
            device,
            (dx + shift_x, dy + shift_y),
            radius=16 if device is laptop_p[0] else 48,
            blur=40 if device is laptop_p[0] else 32,
            opacity=100,
            studio=studio,
        )
    return bg.convert("RGB")


def compose_phone_leading(
    mobile: Image.Image,
    web: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
    phone_style: str = "ios",
) -> Image.Image:
    """Phone-first product story: large phone left, laptop tucked right (different from laptop-led heroes)."""
    margin = 44
    phone = phone_frame(mobile, max_h=980, style=phone_style)
    laptop = browser_in_laptop(web, screen_w=920)
    angled = phone.rotate(-5.5, resample=Image.Resampling.BICUBIC, expand=True)

    # Fit both with phone as the dominant foreground.
    scale = 1.0
    max_h = canvas[1] - margin * 2
    if angled.height > max_h:
        scale = min(scale, max_h / angled.height)
    # Leave room for laptop peeking on the right
    if angled.width + int(laptop.width * 0.55) > canvas[0] - margin * 2:
        scale = min(scale, (canvas[0] - margin * 2) / (angled.width + laptop.width * 0.55))
    if scale < 0.999:
        phone = phone_frame(mobile, max_h=int(980 * scale), style=phone_style)
        angled = phone.rotate(-5.5, resample=Image.Resampling.BICUBIC, expand=True)
        laptop = laptop.resize(
            (max(1, int(laptop.width * scale)), max(1, int(laptop.height * scale))),
            Image.Resampling.LANCZOS,
        )

    bg = make_bg(canvas, tint, studio, strength=0.22 if studio else 0.15, cy_shift=50)

    # Laptop sits lower-right, partially behind the phone's right edge.
    lx = canvas[0] - laptop.width - margin + 10
    ly = (canvas[1] - laptop.height) // 2 + 56
    ax = margin + 28
    ay = (canvas[1] - angled.height) // 2 - 8

    ax = max(margin, min(ax, canvas[0] - angled.width - margin))
    ay = max(margin, min(ay, canvas[1] - angled.height - margin))
    lx = max(margin // 2, min(lx, canvas[0] - laptop.width - margin // 2))
    ly = max(margin // 2, min(ly, canvas[1] - laptop.height - margin // 2))

    # Laptop first (behind), phone on top (leading).
    paste_with_shadow(bg, laptop, (lx, ly), radius=16, blur=38, opacity=90, studio=studio)
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=36, opacity=115, studio=studio)
    return bg.convert("RGB")


def extract_appscreen_device(
    im: Image.Image,
    bg_rgb: tuple[int, int, int] = (5, 5, 7),
    thresh: int = 22,
) -> Image.Image:
    """Knock out AppScreen solid studio bg so the device can float on portfolio plates."""
    rgba = ensure_rgba(im)
    arr = np.asarray(rgba).copy()
    rgb = arr[:, :, :3].astype(np.int16)
    bg = np.array(bg_rgb, dtype=np.int16)
    near = np.abs(rgb - bg).sum(axis=2) <= thresh
    h, w = near.shape
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    from collections import deque

    kill = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    ys, xs = np.where(border & near)
    for y, x in zip(ys.tolist(), xs.tolist()):
        q.append((y, x))
        visited[y, x] = True
    while q:
        y, x = q.popleft()
        kill[y, x] = True
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and near[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))
    arr[kill, 3] = 0
    out = Image.fromarray(arr, "RGBA")
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


def scale_preframed_device(
    device: Image.Image,
    max_h: int = 980,
    max_w: int = 460,
) -> Image.Image:
    """Scale an already-framed AppScreen/device PNG into layout bounds."""
    shot = ensure_rgba(device)
    bbox = shot.getbbox()
    if bbox:
        shot = shot.crop(bbox)
    scale = max_h / shot.height
    if shot.width * scale > max_w:
        scale = max_w / shot.width
    return shot.resize(
        (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
        Image.Resampling.LANCZOS,
    )


def phone_frame(
    screenshot: Image.Image,
    max_h: int = 980,
    max_w: int = 460,
    clean_notifications: bool = True,
    status_fill: tuple[int, int, int] | None = None,
    draw_island: bool = True,
    style: str = "ios",
) -> Image.Image:
    if style == "appscreen":
        return scale_preframed_device(screenshot, max_h=max_h, max_w=max_w)
    if style == "screen":
        return screen_card(screenshot, max_h=max_h, max_w=max_w)
    if style == "android":
        return android_frame(screenshot, max_h=max_h, max_w=max_w)

    shot = fill_baked_round_corners(ensure_rgba(screenshot))
    # Preserve pad metadata across resize (PIL drops .info on some ops)
    ios_pad = shot.info.get("ios_pad")
    ios_pad_fill = shot.info.get("ios_pad_fill")
    keep_status_bar = bool(shot.info.get("keep_status_bar"))
    if clean_notifications:
        shot = clean_status_bar_notifications(shot)
    if status_fill is not None:
        # Solid status strip so Dynamic Island sits on clean chrome (no gray wipe artifacts)
        w, h = shot.size
        bar = max(70, int(h * 0.042))
        ImageDraw.Draw(shot).rectangle((0, 0, w, bar), fill=(*status_fill, 255))
    src_h = shot.height
    scale = max_h / shot.height
    if shot.width * scale > max_w:
        scale = max_w / shot.width
    shot = shot.resize(
        (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
        Image.Resampling.LANCZOS,
    )
    # Draw fake status bar only when the source had none (we padded empty chrome)
    if draw_island and not keep_status_bar and ios_pad is not None:
        pad_scaled = max(36, int(ios_pad * (shot.height / max(1, src_h))))
        fill = ios_pad_fill if ios_pad_fill is not None else (255, 255, 255)
        if status_fill is not None:
            fill = status_fill
        shot = draw_ios_status_bar(shot, pad_scaled, fill)

    bezel = 8
    radius = 52
    # Match inner bezel curve tightly so content fills corners
    screen_r = max(40, radius - bezel + 1)
    w = shot.width + bezel * 2
    h = shot.height + bezel * 2
    device = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)

    # outer shell
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=(32, 34, 36, 255))
    draw.rounded_rectangle((2, 2, w - 3, h - 3), radius=radius - 2, fill=(14, 15, 17, 255))

    # Underlay matches UI edge color so shell never peeks as black tint in corners
    edge = np.asarray(shot.convert("RGB").crop((0, 0, shot.width, min(8, shot.height))))
    under = tuple(int(x) for x in np.median(edge.reshape(-1, 3), axis=0))
    screen = Image.new("RGBA", shot.size, (*under, 255))
    screen.paste(shot, (0, 0), shot if shot.mode == "RGBA" else None)
    if shot.mode != "RGBA":
        screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, screen_r))
    device.paste(screen, (bezel, bezel), screen)

    # dynamic island — optional (skip for Android captures that keep their status bar)
    if draw_island:
        island_w, island_h = int(w * 0.26), 20
        ix = (w - island_w) // 2
        # Sit in the status-bar band, not on app chrome
        iy = bezel + max(6, int(shot.height * 0.012))
        draw.rounded_rectangle(
            (ix, iy, ix + island_w, iy + island_h), radius=10, fill=(6, 6, 8, 255)
        )

    # side buttons
    draw.rounded_rectangle((-3, int(h * 0.18), 2, int(h * 0.24)), radius=2, fill=(55, 58, 60, 255))
    draw.rounded_rectangle((-3, int(h * 0.28), 2, int(h * 0.40)), radius=2, fill=(55, 58, 60, 255))
    draw.rounded_rectangle((w - 3, int(h * 0.30), w + 2, int(h * 0.42)), radius=2, fill=(55, 58, 60, 255))
    return device


def screen_card(
    screenshot: Image.Image,
    max_h: int = 980,
    max_w: int = 460,
    *,
    frame_rgb: tuple[int, int, int] | None = None,
) -> Image.Image:
    """Frameless app screen — rounded corners, subtle rim, no device chrome."""
    shot = ensure_rgba(screenshot)
    # Reserve space for internal safe-area padding before scaling to max bounds.
    pad_top_ratio, pad_side_ratio, pad_bottom_ratio = 0.072, 0.034, 0.028
    content_max_h = int(max_h / (1 + pad_top_ratio + pad_bottom_ratio))
    content_max_w = int(max_w / (1 + 2 * pad_side_ratio))
    scale = content_max_h / shot.height
    if shot.width * scale > content_max_w:
        scale = content_max_w / shot.width
    shot = shot.resize(
        (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
        Image.Resampling.LANCZOS,
    )

    pad_top = max(28, int(shot.height * pad_top_ratio))
    pad_x = max(12, int(shot.width * pad_side_ratio))
    pad_bottom = max(14, int(shot.height * pad_bottom_ratio))
    canvas_w = shot.width + pad_x * 2
    canvas_h = shot.height + pad_top + pad_bottom

    frame = frame_rgb or SCREEN_CARD_FRAME
    card = Image.new("RGBA", (canvas_w, canvas_h), (*frame, 255))
    card.paste(shot, (pad_x, pad_top), shot)

    # Soft top sheen on the chassis so the pad reads intentional, not a black band.
    sheen = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    sheen_draw = ImageDraw.Draw(sheen)
    sheen_top = tuple(min(255, c + 10) for c in frame)
    sheen_bot = frame
    for y in range(pad_top + 6):
        t = y / max(1, pad_top + 5)
        color = tuple(
            int(sheen_top[i] + (sheen_bot[i] - sheen_top[i]) * t) for i in range(3)
        )
        sheen_draw.line([(0, y), (canvas_w, y)], fill=(*color, 255))
    card = Image.alpha_composite(card, sheen)

    radius = max(32, int(min(card.size) * 0.075))
    mask = rounded_mask(card.size, radius)
    framed = Image.new("RGBA", card.size, (0, 0, 0, 0))
    content = card.copy()
    content.putalpha(mask)
    framed.paste(content, (0, 0), content)
    # Muted slate rim — reads on near-black studio plates without a harsh white edge.
    rim = Image.new("RGBA", card.size, (0, 0, 0, 0))
    ImageDraw.Draw(rim).rounded_rectangle(
        (1, 1, card.width - 2, card.height - 2),
        radius=radius,
        outline=SCREEN_CARD_RIM,
        width=2,
    )
    card = Image.alpha_composite(framed, rim)
    return card


def android_frame(
    screenshot: Image.Image,
    max_h: int = 980,
    max_w: int = 460,
) -> Image.Image:
    """Composite screenshot into a real Pixel 7 Pro bezel PNG."""
    if not PIXEL_FRAME.is_file():
        raise FileNotFoundError(f"Missing Pixel frame asset: {PIXEL_FRAME}")

    frame = ensure_rgba(Image.open(PIXEL_FRAME))
    sx0, sy0, sx1, sy1 = PIXEL_SCREEN
    sw, sh = sx1 - sx0, sy1 - sy0

    shot = ensure_rgba(screenshot)
    # Cover-fit into Pixel screen aspect
    scale = max(sw / shot.width, sh / shot.height)
    nw = max(1, int(round(shot.width * scale)))
    nh = max(1, int(round(shot.height * scale)))
    shot = shot.resize((nw, nh), Image.Resampling.LANCZOS)
    x0 = max(0, (nw - sw) // 2)
    y0 = max(0, min((nh - sh) // 8, nh - sh))  # slight top bias for app headers
    shot = shot.crop((x0, y0, x0 + sw, y0 + sh))

    # Soft round screen corners to match Pixel glass
    screen = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask((sw, sh), 28))

    device = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    device.paste(screen, (sx0, sy0), screen)
    device.alpha_composite(frame)

    # Trim transparent outer padding so rotate/layout uses real device bounds
    bbox = device.getbbox()
    if bbox:
        device = device.crop(bbox)

    # Scale to requested max
    scale_out = max_h / device.height
    if device.width * scale_out > max_w:
        scale_out = max_w / device.width
    if scale_out != 1.0:
        device = device.resize(
            (
                max(1, int(device.width * scale_out)),
                max(1, int(device.height * scale_out)),
            ),
            Image.Resampling.LANCZOS,
        )
    return device


def prep_android_for_pixel(
    screenshot: Image.Image,
    *,
    strip_chrome: bool = True,
) -> Image.Image:
    """Prep Android screencaps for Pixel bezel — keep status bar, drop nav chrome."""
    im = ensure_rgba(screenshot)
    w, h = im.size
    top = android_top_letterbox_height(im)
    bottom = android_bottom_chrome_height(im) if strip_chrome else 0
    im = im.crop((0, top, w, h - bottom))
    im = collapse_android_status_gap(im)
    # Light polish only — android_frame cover-fits into Pixel aspect
    rgb = ImageEnhance.Contrast(im.convert("RGB")).enhance(1.03)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.08)
    return rgb.convert("RGBA")


def android_app_content_top(screenshot: Image.Image) -> int:
    """Row where app chrome begins — skip status bar and any dead band above it."""
    w, h = screenshot.size
    arr = np.asarray(screenshot.convert("RGB"))
    means = arr.mean(axis=(1, 2)).astype(np.float32)
    stds = arr.std(axis=(1, 2)).astype(np.float32)

    y = 20
    search_to = min(h, 280)
    while y < search_to:
        if means[y] < 14 and stds[y] < 6:
            run = 0
            while y + run < search_to and means[y + run] < 14 and stds[y + run] < 6:
                run += 1
            if run >= 12:
                return y + run
        y += 1
    return 0


def prep_android_for_screen(
    screenshot: Image.Image,
    *,
    strip_chrome: bool = True,
) -> Image.Image:
    """Crop Android capture to app UI only — no status bar, no nav, no dead bands."""
    im = ensure_rgba(screenshot)
    w, h = im.size
    top = android_top_letterbox_height(im)
    bottom = android_bottom_chrome_height(im) if strip_chrome else 0
    trimmed = im.crop((0, top, w, h - bottom))
    app_y = android_app_content_top(trimmed)
    im = trimmed.crop((0, app_y, trimmed.width, trimmed.height))
    rgb = ImageEnhance.Contrast(im.convert("RGB")).enhance(1.03)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.06)
    return rgb.convert("RGBA")


def laptop_frame(screenshot: Image.Image, screen_w: int = 1100) -> Image.Image:
    """MacBook-style laptop with lid + base."""
    shot = ensure_rgba(screenshot)
    # Fit screenshot into a ~16:10 screen
    target_h = int(screen_w * 0.625)
    shot = shot.resize((screen_w, target_h), Image.Resampling.LANCZOS)

    bezel_x, bezel_top, bezel_bot = 18, 18, 28
    lid_r = 18
    lid_w = shot.width + bezel_x * 2
    lid_h = shot.height + bezel_top + bezel_bot

    # Base proportions
    base_w = int(lid_w * 1.12)
    base_h = 28
    hinge_h = 10
    total_w = base_w
    total_h = lid_h + hinge_h + base_h

    device = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)
    lid_x = (total_w - lid_w) // 2

    # Lid body
    lid = Image.new("RGBA", (lid_w, lid_h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lid)
    ld.rounded_rectangle((0, 0, lid_w - 1, lid_h - 1), radius=lid_r, fill=(38, 40, 42, 255))
    ld.rounded_rectangle((2, 2, lid_w - 3, lid_h - 3), radius=lid_r - 2, fill=(22, 23, 25, 255))

    # Screen with slight inset
    screen = Image.new("RGBA", shot.size, (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, 6))
    lid.paste(screen, (bezel_x, bezel_top), screen)

    # Camera
    cam_r = 4
    cx = lid_w // 2
    ld.ellipse((cx - cam_r, 7, cx + cam_r, 7 + cam_r * 2), fill=(10, 10, 12, 255))
    ld.ellipse((cx - 2, 9, cx + 2, 13), fill=(40, 55, 70, 255))

    # Bottom chin highlight line
    ld.line((bezel_x + 40, lid_h - 12, lid_w - bezel_x - 40, lid_h - 12), fill=(55, 58, 62, 180), width=1)

    device.paste(lid, (lid_x, 0), lid)

    # Hinge
    hinge_y = lid_h
    draw.rectangle((lid_x + 40, hinge_y, lid_x + lid_w - 40, hinge_y + hinge_h), fill=(48, 50, 52, 255))
    draw.rounded_rectangle(
        (lid_x + 30, hinge_y + 2, lid_x + lid_w - 30, hinge_y + hinge_h - 1),
        radius=3,
        fill=(58, 60, 62, 255),
    )

    # Base / deck
    base_y = lid_h + hinge_h
    # perspective-ish trapezoid via wider base rectangle with rounded front
    draw.rounded_rectangle((0, base_y, total_w - 1, base_y + base_h - 1), radius=6, fill=(52, 54, 56, 255))
    # front lip
    draw.rounded_rectangle((8, base_y + base_h - 10, total_w - 9, base_y + base_h - 1), radius=4, fill=(42, 44, 46, 255))
    # trackpad suggestion
    tw, th = int(base_w * 0.22), 4
    tx = (total_w - tw) // 2
    draw.rounded_rectangle((tx, base_y + 6, tx + tw, base_y + 6 + th), radius=2, fill=(70, 72, 74, 160))

    return device


def monitor_frame(screenshot: Image.Image, screen_w: int = 900) -> Image.Image:
    """Desktop monitor (16:10 screen) with slim bezel, neck and base."""
    shot = ensure_rgba(screenshot)
    target_h = int(screen_w * 0.625)  # 16:10
    shot = fit_web_for_laptop(shot, screen_w, target_h, mode="width")

    bezel = 16
    chin = 34
    panel_w = shot.width + bezel * 2
    panel_h = shot.height + bezel + chin
    panel_r = 20

    neck_w = int(panel_w * 0.10)
    neck_h = int(panel_h * 0.11)
    base_w = int(panel_w * 0.40)
    base_h = 20

    total_w = panel_w
    total_h = panel_h + neck_h + base_h
    device = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)

    # Panel shell
    draw.rounded_rectangle((0, 0, panel_w - 1, panel_h - 1), radius=panel_r, fill=(34, 36, 39, 255))
    draw.rounded_rectangle((3, 3, panel_w - 4, panel_h - 4), radius=panel_r - 2, fill=(16, 17, 19, 255))

    # Screen
    screen = Image.new("RGBA", shot.size, (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, 6))
    device.paste(screen, (bezel, bezel), screen)

    # Chin logo dot
    cx = panel_w // 2
    cy = panel_h - chin // 2
    draw.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(70, 74, 80, 255))

    # Neck
    nx = (total_w - neck_w) // 2
    ny = panel_h
    draw.rectangle((nx, ny, nx + neck_w, ny + neck_h), fill=(48, 50, 54, 255))
    draw.rectangle((nx + 3, ny, nx + neck_w - 3, ny + neck_h), fill=(58, 61, 66, 255))

    # Base
    bx = (total_w - base_w) // 2
    by = panel_h + neck_h
    draw.rounded_rectangle((bx, by, bx + base_w, by + base_h - 1), radius=8, fill=(56, 59, 63, 255))
    draw.rounded_rectangle(
        (bx + 6, by + base_h - 8, bx + base_w - 6, by + base_h - 1), radius=4, fill=(44, 46, 50, 255)
    )
    return device


def tablet_frame(screenshot: Image.Image, screen_w: int = 460) -> Image.Image:
    """Tablet (iPad-style) — uniform bezel, rounded corners, front camera dot.

    Keeps the screenshot's own aspect ratio (no distortion); just scales to
    screen_w and wraps it in a slim modern bezel.
    """
    shot = ensure_rgba(screenshot)
    scale = screen_w / shot.width
    shot = shot.resize(
        (screen_w, max(1, int(shot.height * scale))), Image.Resampling.LANCZOS
    )

    bezel = max(16, int(screen_w * 0.035))
    radius = max(34, int(screen_w * 0.075))
    screen_r = max(20, radius - bezel + 2)
    w = shot.width + bezel * 2
    h = shot.height + bezel * 2
    device = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)

    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=(30, 32, 35, 255))
    draw.rounded_rectangle((2, 2, w - 3, h - 3), radius=radius - 2, fill=(14, 15, 17, 255))

    screen = Image.new("RGBA", shot.size, (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, screen_r))
    device.paste(screen, (bezel, bezel), screen)

    # Front camera — centered on the top bezel (landscape → long edge)
    cam = 6
    draw.ellipse((w // 2 - cam, bezel // 2 - cam, w // 2 + cam, bezel // 2 + cam), fill=(8, 8, 10, 255))
    return device


def compose_device_family(
    monitor_shot: Image.Image,
    laptop_shot: Image.Image,
    tablet_shot: Image.Image,
    phone_shot: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = True,
    phone_status_fill: tuple[int, int, int] | None = None,
    clean_notifications: bool = True,
    phone_style: str = "ios",
) -> Image.Image:
    """Responsive family hero: monitor (back) + laptop + tablet + phone (front).

    Devices form a tight, overlapping cluster sitting on a common baseline so
    the set reads as one product across every screen. A soft elliptical floor
    shadow grounds the whole group.
    """
    margin = 44

    def build(scale: float):
        monitor = monitor_frame(monitor_shot, screen_w=int(980 * scale))
        laptop = browser_in_laptop(laptop_shot, screen_w=int(560 * scale))
        tablet = tablet_frame(tablet_shot, screen_w=int(452 * scale))
        phone = phone_frame(
            phone_shot,
            max_h=int(590 * scale),
            clean_notifications=clean_notifications,
            status_fill=phone_status_fill,
            style=phone_style,
        )
        # Self-contained cluster in local coordinates (origin at 0,0).
        # Front row (laptop | phone | tablet) overlaps the monitor's lower ~38%
        # and shares one baseline; the phone steps forward as the foreground.
        overlap = int(monitor.height * 0.28)
        row_top = monitor.height - overlap
        baseline = row_top + phone.height  # phone is tallest → defines the floor

        lx = 0
        ly = baseline - laptop.height
        # Phone laps the laptop's right edge and sits lowest (foreground). Keep
        # the bite shallow — a deeper tuck hides the laptop's content column.
        px = lx + laptop.width - int(phone.width * 0.22)
        py = baseline - phone.height
        # Tablet tucks behind the phone's right side, slightly raised.
        tx = px + phone.width - int(tablet.width * 0.16)
        ty = baseline - tablet.height - int(tablet.height * 0.05)

        cluster_w = tx + tablet.width
        mx = (cluster_w - monitor.width) // 2
        my = 0
        placements = [
            (monitor, mx, my),
            (laptop, lx, ly),
            (tablet, tx, ty),
            (phone, px, py),
        ]
        return placements, baseline

    scale = 1.0
    placements, baseline = build(scale)
    for _ in range(14):
        xs = [p[1] for p in placements] + [p[1] + p[0].width for p in placements]
        ys = [p[2] for p in placements] + [p[2] + p[0].height for p in placements]
        need_w = max(xs) - min(xs)
        need_h = max(ys) - min(ys)
        fit = min(
            (canvas[0] - margin * 2) / max(1, need_w),
            (canvas[1] - margin * 2) / max(1, need_h),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.98
        placements, baseline = build(scale)

    # Center the whole cluster
    xs = [p[1] for p in placements] + [p[1] + p[0].width for p in placements]
    ys = [p[2] for p in placements] + [p[2] + p[0].height for p in placements]
    shift_x = (canvas[0] - (max(xs) - min(xs))) // 2 - min(xs)
    shift_y = (canvas[1] - (max(ys) - min(ys))) // 2 - min(ys)

    bg = make_bg(canvas, tint, studio, strength=0.2 if studio else 0.14, cy_shift=30)

    # Grounding floor shadow — soft wide ellipse under the front row so the
    # devices feel placed on a surface rather than floating.
    floor_y = baseline + shift_y - 6
    cluster_l = min(p[1] for p in placements[1:]) + shift_x
    cluster_r = max(p[1] + p[0].width for p in placements[1:]) + shift_x
    cx = (cluster_l + cluster_r) // 2
    half_w = int((cluster_r - cluster_l) * 0.52)
    ell_h = int(150 * scale)
    floor = Image.new("RGBA", canvas, (0, 0, 0, 0))
    ImageDraw.Draw(floor).ellipse(
        (cx - half_w, floor_y - ell_h // 2, cx + half_w, floor_y + ell_h // 2),
        fill=(0, 0, 0, 150 if studio else 110),
    )
    floor = floor.filter(ImageFilter.GaussianBlur(int(46 * scale)))
    bg = Image.alpha_composite(bg, floor)

    # Back-to-front: monitor, laptop, tablet, phone
    order = [
        (placements[0], 18, 44, 105),  # monitor
        (placements[1], 16, 38, 92),   # laptop
        (placements[2], 40, 34, 96),   # tablet
        (placements[3], 48, 34, 120),  # phone (front, strongest shadow)
    ]
    for (device, dx, dy), radius, blur, opacity in order:
        paste_with_shadow(
            bg,
            device,
            (dx + shift_x, dy + shift_y),
            radius=radius,
            blur=blur,
            opacity=opacity,
            studio=studio,
        )
    return bg.convert("RGB")


def crop_at_section_boundary(
    shot: Image.Image,
    lo: float = 0.62,
    hi: float = 0.96,
) -> Image.Image:
    """Trim a page capture at the last section colour change in [lo, hi].

    A viewport screenshot usually ends part-way into the following section,
    slicing its headline in half. Cutting at the band where the page background
    changes leaves a clean edge that `mode="hero"` can then pad out.
    """
    im = ensure_rgba(shot)
    rgb = im.convert("RGB")
    w, h = rgb.size
    # One averaged column of the page: row colour without per-pixel noise.
    strip = rgb.resize((1, h), Image.Resampling.LANCZOS)
    y0, y1 = int(h * lo), int(h * hi)

    # A new section reads as a long run of near-constant background colour.
    # Isolated changes inside the hero (cards, pills, buttons) are short runs,
    # so take the longest run and cut at where it begins.
    runs: list[tuple[int, int]] = []  # (start, length)
    start = y0
    base = strip.getpixel((0, y0))
    for y in range(y0 + 1, y1):
        cur = strip.getpixel((0, y))
        if max(abs(cur[i] - base[i]) for i in range(3)) > 6:
            runs.append((start, y - start))
            start, base = y, cur
    runs.append((start, y1 - start))

    # The hero's own background is a long run too, so take the *last* run that
    # is substantial enough to be a section — that is the one intruding at the
    # bottom of the viewport — and cut where it starts.
    solid = [r for r in runs if r[1] >= int(h * 0.05)]
    if len(solid) < 2:
        return im
    cut = solid[-1][0]
    if cut <= y0:
        return im
    return im.crop((0, 0, w, cut))


def fit_web_for_laptop(
    shot: Image.Image,
    screen_w: int,
    target_h: int,
    mode: str = "width",
) -> Image.Image:
    """Fit a webpage shot into the laptop screen.

    mode="width" (default): scale to full width, crop/pad height only.
    Never crop left/right — that chops headlines.

    mode="contain": zoom out — scale the whole shot to fit inside the
    screen (width and height), pad with white. Use when the plate includes
    more than one viewport of page content (hero + stats, etc.).
    """
    shot = ensure_rgba(shot)
    sw, sh = shot.size
    if mode == "contain":
        scale = min(screen_w / sw, target_h / sh)
        nw = max(1, int(sw * scale))
        nh = max(1, int(sh * scale))
        shot = shot.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (screen_w, target_h), (255, 255, 255, 255))
        # Top-align so nav/hero stay readable; small side margins OK
        canvas.paste(shot, ((screen_w - nw) // 2, 0), shot)
        return canvas

    if mode == "hero":
        # Scale to full width; if the shot is shorter than the screen, extend it
        # with its own bottom-edge colour instead of white so the fill is
        # invisible. Pair with crop_at_section_boundary() to cut a page above
        # the next section rather than through its headline.
        scale = screen_w / sw
        new_h = max(1, int(sh * scale))
        shot = shot.resize((screen_w, new_h), Image.Resampling.LANCZOS)
        if new_h >= target_h:
            return shot.crop((0, 0, screen_w, target_h))
        edge = shot.convert("RGB").resize((1, new_h), Image.Resampling.LANCZOS)
        # Sample above the final rows: a crop made at a section boundary leaves
        # a few transition pixels there, and matching those tints the fill.
        fill = edge.getpixel((0, max(0, new_h - 1 - int(new_h * 0.02)))) + (255,)
        canvas = Image.new("RGBA", (screen_w, target_h), fill)
        canvas.paste(shot, (0, 0), shot)
        return canvas

    if mode == "fullpage":
        # Entire long page → fill laptop screen (non-uniform scale).
        # Prefer this over contain for very tall full-page captures, which
        # otherwise become an unreadable thin ribbon with huge side gaps.
        return shot.resize((screen_w, target_h), Image.Resampling.LANCZOS)

    scale = screen_w / sw
    new_h = max(1, int(sh * scale))
    if new_h >= target_h:
        # Tall enough: scale to width, keep the top of the page (logo + hero).
        shot = shot.resize((screen_w, new_h), Image.Resampling.LANCZOS)
        shot = shot.crop((0, 0, screen_w, target_h))
    else:
        # Ultra-wide capture (e.g. 2:1 desktop grabs) is shorter than the
        # 16:10 screen. Padding leaves a dead white band across the laptop, so
        # cover instead: scale to height and trim the width off the right, so
        # the left edge — app sidebar, logo, primary column — stays intact.
        cover = target_h / sh
        cw = max(screen_w, int(sw * cover))
        shot = shot.resize((cw, target_h), Image.Resampling.LANCZOS)
        shot = shot.crop((0, 0, screen_w, target_h))
    return shot


def browser_in_laptop(
    screenshot: Image.Image,
    screen_w: int = 1100,
    fit: str = "width",
) -> Image.Image:
    """Wrap a screenshot in minimal browser chrome, then a laptop shell."""
    target_h = int(screen_w * 0.625)
    shot = fit_web_for_laptop(screenshot, screen_w, target_h, mode=fit)

    chrome_h = 36
    framed = Image.new("RGBA", (screen_w, target_h + chrome_h), (250, 248, 243, 255))
    draw = ImageDraw.Draw(framed)
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        x = 14 + i * 16
        draw.ellipse((x, 12, x + 9, 21), fill=color)
    draw.rounded_rectangle((70, 9, screen_w - 14, 27), radius=7, fill=(255, 255, 255, 255))
    draw.rounded_rectangle((70, 9, screen_w - 14, 27), radius=7, outline=(220, 214, 200, 255))
    # URL hint
    draw.rounded_rectangle((78, 12, 260, 24), radius=4, fill=(240, 236, 228, 255))
    framed.paste(shot, (0, chrome_h), shot)
    return laptop_frame(framed, screen_w=screen_w)


def crop_phone_from_desktop(im: Image.Image) -> Image.Image:
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w, _ = arr.shape
    gray = arr.mean(axis=2)
    mid = w // 2
    midband = gray[int(h * 0.25) : int(h * 0.75), :]
    left_edge, right_edge = int(w * 0.35), int(w * 0.65)
    for x in range(mid, int(w * 0.15), -1):
        if midband[:, x].mean() < 5 and midband[:, x].std() < 3:
            left_edge = x + 1
            break
    for x in range(mid, int(w * 0.85)):
        if midband[:, x].mean() < 5 and midband[:, x].std() < 3:
            right_edge = x - 1
            break

    strip = gray[:, left_edge:right_edge]
    y0, y1 = int(h * 0.12), int(h * 0.88)
    region = strip[y0:y1]
    content = (region.std(axis=1) > 8) & (region.mean(axis=1) > 6)
    ridx = np.where(content)[0]
    if len(ridx) < 10:
        top, bot = y0, y1
    else:
        top, bot = y0 + int(ridx[0]), y0 + int(ridx[-1])
    pad = 4
    return im.crop((left_edge, max(0, top - pad), right_edge, min(h, bot + pad)))


def save(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    # JPEG keeps studio plates smaller without visible quality loss
    out = path.with_suffix(".jpg")
    rgb.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    if path.suffix.lower() == ".png" and path.exists() and path != out:
        path.unlink(missing_ok=True)
    print(f"  → {out.relative_to(ROOT)} ({im.size[0]}×{im.size[1]}, {out.stat().st_size // 1024}KB)")


def save_set(dest: Path, images: list[Image.Image]) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    # Only clear plate outputs — keep app icons and other assets in the folder
    for old in dest.glob("hero.*"):
        old.unlink()
    for old in dest.glob("detail-*.*"):
        old.unlink()
    if not images:
        return
    save(images[0], dest / "hero.jpg")
    for i, im in enumerate(images[1:], start=1):
        save(im, dest / f"detail-{i}.jpg")


def open_shot(*parts: str) -> Image.Image:
    path = SHOTS.joinpath(*parts)
    if not path.exists():
        matches = list(path.parent.glob(path.name.replace(" ", "*")))
        if not matches:
            raise FileNotFoundError(path)
        path = matches[0]
    return Image.open(path)


def crop_to_43(im: Image.Image, bias: float = 0.42) -> Image.Image:
    w, h = im.size
    target_h = int(w / (4 / 3))
    if h <= target_h:
        return im
    top = int((h - target_h) * bias)
    return im.crop((0, top, w, top + target_h))


def fit_on_plate(
    im: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = True,
    pad: float = 0.06,
) -> Image.Image:
    """Letterbox an existing asset onto a studio/light plate without cropping content."""
    bg = make_bg(canvas, tint, studio, strength=0.22 if studio else 0.12, cy_shift=20)
    max_w = int(canvas[0] * (1 - pad * 2))
    max_h = int(canvas[1] * (1 - pad * 2))
    shot = ensure_rgba(im)
    scale = min(max_w / shot.width, max_h / shot.height)
    nw, nh = max(1, int(shot.width * scale)), max(1, int(shot.height * scale))
    shot = shot.resize((nw, nh), Image.Resampling.LANCZOS)
    # soft shadow under the asset
    shadow = drop_shadow(shot.size, radius=18, blur=28, opacity=110 if studio else 70)
    sx = (canvas[0] - shadow.width) // 2
    sy = (canvas[1] - shadow.height) // 2 + 10
    bg.paste(shadow, (sx, sy), shadow)
    dx = (canvas[0] - nw) // 2
    dy = (canvas[1] - nh) // 2
    bg.paste(shot, (dx, dy), shot)
    return bg.convert("RGB")


def extract_store_device(im: Image.Image) -> Image.Image:
    """Keep the store phone (with its own bezel) and drop marketing headlines."""
    w, h = im.size
    return im.crop((int(w * 0.155), int(h * 0.205), int(w * 0.845), int(h * 0.975)))


def crop_innerverse_screen(im: Image.Image) -> Image.Image:
    """App UI only — strip Play Store marketing copy and store-mockup bezel."""
    w, h = im.size
    # The store graphic centres a phone mockup on a starfield, but not at the
    # same x across screenshots — a fixed fraction slices the first letter off
    # headings ("Good evening" → "ood evening"). Find the device edges instead.
    rgb = im.convert("RGB")
    lefts, rights = [], []
    for frac in (0.35, 0.45, 0.55, 0.65):
        y = int(h * frac)
        row = [rgb.getpixel((x, y)) for x in range(w)]
        bg = row[2]
        xs = [
            x
            for x, c in enumerate(row)
            if max(abs(c[i] - bg[i]) for i in range(3)) > 18
        ]
        if xs:
            lefts.append(xs[0])
            rights.append(xs[-1])
    if lefts and rights:
        lefts.sort()
        rights.sort()
        x0, x1 = lefts[len(lefts) // 2], rights[len(rights) // 2]
        inset = int((x1 - x0) * 0.015)  # step just inside the bezel
        x0, x1 = x0 + inset, x1 - inset
    else:
        x0, x1 = int(w * 0.195), int(w * 0.805)
    # Keep header + bottom nav; pad so content clears island + chin in phone_frame
    screen = im.crop((x0, int(h * 0.215), x1, int(h * 0.985)))
    # Pad is pre-scale; keep generous so it still clears island + chin after resize
    pad_top = max(64, int(screen.height * 0.065))
    pad_bot = max(88, int(screen.height * 0.06))
    sw, sh = screen.size
    fill = screen.getpixel((min(12, sw - 1), min(8, sh - 1)))
    if isinstance(fill, int):
        fill = (fill, fill, fill, 255)
    elif len(fill) == 3:
        fill = (*fill, 255)
    out = Image.new("RGBA", (sw, sh + pad_top + pad_bot), fill)
    out.paste(ensure_rgba(screen), (0, pad_top))
    return out


def compose_innerverse_hero(
    cosmos: Image.Image,
    mood: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (120, 85, 165),
) -> Image.Image:
    """
    Innerverse hero: oversized cosmos phone forward, mood log peeking behind.
    Dark plate + large devices (fills the frame — no sparse cream dual).
    """
    bg = make_bg(canvas, tint, studio=True, strength=0.22, cy_shift=20)
    margin = 24

    # Bigger than default phone_frame caps so devices own the plate
    lead = phone_frame(cosmos, max_h=1120, max_w=520)
    support = phone_frame(mood, max_h=900, max_w=430)
    lead_r = lead.rotate(3.5, resample=Image.Resampling.BICUBIC, expand=True)
    support_r = support.rotate(-8.5, resample=Image.Resampling.BICUBIC, expand=True)

    span_w = support_r.width + int(lead_r.width * 0.68)
    span_h = max(support_r.height, lead_r.height)
    scale = 1.0
    if span_w > canvas[0] - margin * 2:
        scale = min(scale, (canvas[0] - margin * 2) / span_w)
    if span_h > canvas[1] - margin * 2:
        scale = min(scale, (canvas[1] - margin * 2) / span_h)
    if scale < 0.999:
        lead = phone_frame(cosmos, max_h=int(1120 * scale), max_w=int(520 * scale))
        support = phone_frame(mood, max_h=int(900 * scale), max_w=int(430 * scale))
        lead_r = lead.rotate(3.5, resample=Image.Resampling.BICUBIC, expand=True)
        support_r = support.rotate(-8.5, resample=Image.Resampling.BICUBIC, expand=True)

    mid_y = canvas[1] // 2
    sx = margin
    sy = mid_y - support_r.height // 2 + 70
    lx = canvas[0] - lead_r.width - margin
    ly = mid_y - lead_r.height // 2 - 6

    paste_with_shadow(bg, support_r, (sx, sy), radius=48, blur=36, opacity=85, studio=True)
    paste_with_shadow(bg, lead_r, (lx, ly), radius=52, blur=42, opacity=125, studio=True)
    return bg.convert("RGB")


def compose_device_shots(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = True,
    max_h: int = 980,
    round_corners: bool = False,
) -> Image.Image:
    """Lay out device / store shots on a plate (no second phone bezel)."""
    bg = make_bg(canvas, tint, studio, strength=0.2 if studio else 0.14, cy_shift=40)
    devices: list[Image.Image] = []
    for shot in shots[:3]:
        d = ensure_rgba(shot)
        scale = min(max_h / d.height, (canvas[0] * 0.46) / d.width)
        d = d.resize((max(1, int(d.width * scale)), max(1, int(d.height * scale))), Image.Resampling.LANCZOS)
        if round_corners:
            mask = rounded_mask(d.size, radius=28)
            layered = Image.new("RGBA", d.size, (0, 0, 0, 0))
            layered.paste(d, (0, 0))
            layered.putalpha(mask)
            devices.append(layered)
        else:
            devices.append(d)

    gap = 28 if len(devices) < 3 else 18
    total_w = sum(d.width for d in devices) + gap * (len(devices) - 1)
    x = (canvas[0] - total_w) // 2
    for i, device in enumerate(devices):
        y = (canvas[1] - device.height) // 2
        paste_with_shadow(bg, device, (x, y), radius=12, blur=28, opacity=90, studio=studio)
        x += device.width + gap
    return bg.convert("RGB")


def build_innerverse() -> None:
    print("Innerverse")
    dest = OUT / "innerverse"
    mood = crop_innerverse_screen(open_shot("Innerverse", "screenshot-2.png"))
    cosmos = crop_innerverse_screen(open_shot("Innerverse", "screenshot-3.png"))
    trends = crop_innerverse_screen(open_shot("Innerverse", "screenshot-4.png"))
    mira = crop_innerverse_screen(open_shot("Innerverse", "screenshot-6.png"))
    archive = crop_innerverse_screen(open_shot("Innerverse", "screenshot-7.png"))
    insights = crop_innerverse_screen(open_shot("Innerverse", "screenshot-5.png"))
    tint = (120, 85, 165)

    # Hero covers mood/trends/cosmos/Mira — one detail for screens the fan doesn't show well
    save_set(
        dest,
        [
            compose_quad_phones([mood, trends, cosmos, mira], tint=tint, studio=True),
            compose_dual_phones(
                insights, archive, tint=tint, studio=True, gap=96, angle=1.5, max_h=760, margin=64
            ),
        ],
    )


def build_qubio() -> None:
    print("Qubio")
    dest = OUT / "qubio"
    home = open_shot("Qubio", "App", "Home.png")
    qr = open_shot("Qubio", "App", "QrBody.png")
    pages = open_shot("Qubio", "App", "AllPages.png")
    blocks = open_shot("Qubio", "App", "AddBlock.png")
    qrinfo = open_shot("Qubio", "App", "QrInfoPage.png")
    share = open_shot("Qubio", "App", "ShareQrMulti.png")
    web = open_shot("Qubio", "Web", "WebDesktop.png")
    tint = (122, 82, 214)
    for old in dest.glob("detail-*.*"):
        old.unlink(missing_ok=True)
    for old in dest.glob("hero.*"):
        old.unlink(missing_ok=True)
    save(compose_laptop_flanked(web, pages, qr, tint=tint), dest / "hero.jpg")
    save(compose_dual_phones(home, blocks, tint=tint), dest / "detail-1.jpg")
    save(compose_dual_phones(qrinfo, share, tint=tint), dest / "detail-2.jpg")


def build_dealflow() -> None:
    print("Dealflow AI")
    dest = OUT / "dealflow-ai"
    web_files = sorted((SHOTS / "DealFlow").glob("Screenshot 2026-05-12*.png"))
    mob_files = sorted((SHOTS / "DealFlow").glob("Screenshot_*.png"))
    web1, web2 = Image.open(web_files[0]), Image.open(web_files[1])
    mob_dash = Image.open(mob_files[1]) if len(mob_files) > 1 else Image.open(mob_files[0])
    mob_alt = Image.open(mob_files[2]) if len(mob_files) > 2 else mob_dash
    tint = (20, 140, 125)
    save_set(
        dest,
        [
            compose_laptop_phone(web1, mob_dash, tint=tint, studio=True),
            compose_dual_phones(mob_dash, mob_alt, tint=tint, studio=True),
            compose_plate(browser_in_laptop(web2, screen_w=1180), tint=tint, offset_y=8, studio=True),
            compose_laptop_phone(web2, mob_alt, tint=tint, phone_side="left", studio=True),
        ],
    )


def build_bschedule() -> None:
    print("BSchedule")
    dest = OUT / "bschedule"
    files = sorted((SHOTS / "Bschedule").glob("*.png"))
    shots = [Image.open(f) for f in files[:4]]
    tint = (0, 120, 180)
    hero = compose_triple_phones(shots[:3], tint=tint) if len(shots) >= 3 else compose_dual_phones(shots[0], shots[1], tint=tint)
    save_set(
        dest,
        [
            hero,
            compose_dual_phones(shots[0], shots[1], tint=tint),
            compose_plate(phone_frame(shots[2] if len(shots) > 2 else shots[0]), tint=tint),
        ],
    )


def build_bugmapper() -> None:
    print("Bugmapper")
    dest = OUT / "bugmapper"
    tmp = ROOT / ".tmp-shots" / "bm-best"
    web = ROOT / ".tmp-shots" / "bugmapper-web-product.png"
    if not web.exists():
        web = ROOT / ".tmp-shots" / "bugmapper-web-hero.png"
    home = Image.open(tmp / "01-home.png")
    chart = Image.open(tmp / "04-plant-chart.png")
    pim = Image.open(tmp / "06-pim.png")
    sync = Image.open(tmp / "07-sync.png")
    tint = (139, 90, 52)
    save_set(
        dest,
        [
            # Hero: product context — BugMapper web + field phone
            compose_laptop_phone(Image.open(web), home, tint=tint),
            # Offline queue + PIM photo upload
            compose_dual_phones(sync, pim, tint=tint, gap=120, angle=1.2),
            # Trap list + disease chart
            compose_dual_phones(home, chart, tint=tint, gap=110, angle=1.2),
        ],
    )


INTERIO_CREAM = (247, 245, 239)


def fit_interio_screen(screenshot: Image.Image) -> Image.Image:
    """Prep Interio Android captures for clean iPhone mockups.

    Strips status + system nav, cover-fits to modern phone aspect, then adds a
    cream top band so the Dynamic Island sits on brand chrome — not over titles.
    """
    im = ensure_rgba(screenshot)
    w, h = im.size
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    means = arr.mean(axis=(1, 2))
    stds = arr.std(axis=(1, 2))

    # Top — dark Android status bar
    top = 0
    while top < int(h * 0.09) and means[top] < 70:
        top += 1
    top = max(top + 2, int(h * 0.032))

    # Bottom — solid white system nav / 3-button bar
    y = h - 1
    floor = int(h * 0.86)
    while y > floor and means[y] > 245 and stds[y] < 18:
        y -= 1
    bottom = max(h - 1 - y + 6, int(h * 0.045))

    im = im.crop((0, top, w, h - bottom))

    # COVER into phone aspect so corners fill the bezel
    target_ar = 9 / 19.5
    cw, ch = im.size
    tw = cw
    th = max(1, int(round(cw / target_ar)))
    scale = max(tw / max(cw, 1), th / max(ch, 1))
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x0 = max(0, (nw - tw) // 2)
    y0 = 0
    surplus = nh - th
    if surplus > 0:
        y0 = min(int(surplus * 0.1), surplus)
    im = im.crop((x0, y0, x0 + tw, y0 + th))

    # Cream top pad for island; white bottom pad so tab bar clears the chin cleanly
    pad_top = max(52, int(th * 0.042))
    pad_bot = max(40, int(th * 0.03))
    out = Image.new("RGBA", (tw, th + pad_top + pad_bot), (*INTERIO_CREAM, 255))
    ImageDraw.Draw(out).rectangle(
        (0, th + pad_top, tw, th + pad_top + pad_bot), fill=(255, 255, 255, 255)
    )
    out.paste(ensure_rgba(im), (0, pad_top))

    rgb = ImageEnhance.Contrast(out.convert("RGB")).enhance(1.03)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.12)
    return rgb.convert("RGBA")


def strip_android_nav_only(screenshot: Image.Image) -> Image.Image:
    """Remove only the solid system gesture/nav band — keep status + app UI as-shot."""
    im = ensure_rgba(screenshot)
    w, h = im.size
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    means = arr.mean(axis=(1, 2))
    stds = arr.std(axis=(1, 2))
    y = h - 1
    # Stay in the bottom ~10% so we never eat the app tab bar
    floor = int(h * 0.90)
    while y > floor and means[y] > 248 and stds[y] < 8:
        y -= 1
    bottom = h - 1 - y
    if bottom < 24:
        return im
    return im.crop((0, 0, w, h - bottom - 2))


def build_interio() -> None:
    print("Interio")
    dest = OUT / "interio"
    tint = (95, 135, 110)  # sage

    def load(name: str) -> Image.Image:
        return fit_interio_screen(open_shot("Interio", name))

    # Hero story: browse spaces → place sofa in AR (best product pair)
    home = load("01-home.png")
    ar = load("06-ar-sofa-selected.png")
    post = load("05-post-scan-fresh.png")
    scan = load("04-camera-detected.png")

    save_set(
        dest,
        [
            compose_dual_phones(
                home,
                ar,
                tint=tint,
                gap=68,
                angle=0.5,
                max_h=1100,
                margin=32,
                clean_notifications=False,
                draw_island=True,
            ),
            compose_plate(
                phone_frame(
                    post, max_h=1140, max_w=530, clean_notifications=False, draw_island=True
                ),
                tint=tint,
            ),
            compose_plate(
                phone_frame(
                    scan, max_h=1140, max_w=530, clean_notifications=False, draw_island=True
                ),
                tint=tint,
            ),
        ],
    )


def build_safedeal() -> None:
    print("SafeDeal")
    dest = OUT / "safedeal"
    tmp = ROOT / ".tmp-shots" / "safedeal-phones"
    web = ROOT / ".tmp-shots" / "safedeal-web-product.png"
    if not web.exists():
        web = ROOT / ".tmp-shots" / "safedeal-web-howto.png"
    home = Image.open(tmp / "01-home.png")
    product_insights = Image.open(tmp / "02-product-insights.png")
    ai_insights = Image.open(tmp / "03-ai-insights.png")
    product_page = Image.open(tmp / "04-product-page.png")
    # Brand green from Safe Deal marketing / shield UI
    tint = (46, 160, 90)
    save_set(
        dest,
        [
            # Hero: full marketing site in laptop + analysis sheet on phone
            compose_laptop_phone(
                Image.open(web), product_insights, tint=tint, web_fit="contain"
            ),
            # Differentiator: product rules/price chart + AI review summary
            compose_dual_phones(product_insights, ai_insights, tint=tint, gap=120, angle=1.2),
            # Daily flow: marketplace hub → product page in the in-app browser
            compose_dual_phones(home, product_page, tint=tint, gap=110, angle=1.2),
        ],
    )


def compose_store_dual(
    left: Image.Image,
    right: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (20, 48, 42),
    gap: int = 28,
    margin: int = 40,
) -> Image.Image:
    """Two App Store–style portrait plates side by side on a studio canvas."""
    bg = make_bg(canvas, tint, studio=True, strength=0.28, cy_shift=20)
    max_h = canvas[1] - margin * 2
    max_w = (canvas[0] - margin * 2 - gap) // 2

    def fit(im: Image.Image) -> Image.Image:
        shot = ensure_rgba(im)
        scale = min(max_h / shot.height, max_w / shot.width)
        return shot.resize(
            (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
            Image.Resampling.LANCZOS,
        )

    a, b = fit(left), fit(right)
    total_w = a.width + b.width + gap
    x0 = (canvas[0] - total_w) // 2
    y0 = (canvas[1] - max(a.height, b.height)) // 2
    paste_with_shadow(bg, a, (x0, y0 + (max(a.height, b.height) - a.height) // 2), radius=28, blur=22, opacity=90, studio=True)
    paste_with_shadow(
        bg,
        b,
        (x0 + a.width + gap, y0 + (max(a.height, b.height) - b.height) // 2),
        radius=28,
        blur=22,
        opacity=90,
        studio=True,
    )
    return bg.convert("RGB")


def build_meet_and_greet() -> None:
    """Meet & Greet — AppScreen store frames + product UI fan."""
    print("Meet & Greet")
    dest = OUT / "meet-and-greet"
    tmp = ROOT / ".tmp-shots" / "meet-and-greet"
    store = tmp / "appscreen"
    online = Image.open(tmp / "01-online.png")
    dial = Image.open(tmp / "02-dial.png")
    call = Image.open(tmp / "03-call-1to1.png")
    group = Image.open(tmp / "04-group.png")
    s1 = Image.open(store / "screenshot-1.png")  # online
    s2 = Image.open(store / "screenshot-2.png")  # dial
    s3 = Image.open(store / "screenshot-3.png")  # 1:1
    s4 = Image.open(store / "screenshot-4.png")  # group
    tint = (26, 72, 62)
    save_set(
        dest,
        [
            # Hero: product fan — presence, dial, 1:1, group
            compose_quad_phones([online, dial, call, group], tint=tint, studio=True),
            # AppScreen polish — presence + live call
            compose_store_dual(s1, s3, tint=tint),
            # AppScreen — dial + group
            compose_store_dual(s2, s4, tint=tint),
        ],
    )


def android_top_letterbox_height(screenshot: Image.Image) -> int:
    """Detect flat black/dead rows above the status bar (common in Android screencaps)."""
    arr = np.asarray(screenshot.convert("RGB")).astype(np.float32)
    h, _w, _c = arr.shape
    means = arr.mean(axis=(1, 2))
    stds = arr.std(axis=(1, 2))
    y = 0
    ceiling = int(h * 0.07)
    while y < ceiling and means[y] < 20 and stds[y] < 12:
        y += 1
    return max(0, y)


def collapse_android_status_gap(screenshot: Image.Image) -> Image.Image:
    """Remove the dead black band between the status bar and app header."""
    im = ensure_rgba(screenshot)
    w, h = im.size
    arr = np.asarray(im.convert("RGB"))
    means = arr.mean(axis=(1, 2)).astype(np.float32)
    stds = arr.std(axis=(1, 2)).astype(np.float32)

    gap_start = None
    gap_end = None
    search_to = min(h, 280)
    y = 24  # skip the status-bar icon band
    while y < search_to:
        if means[y] < 14 and stds[y] < 6:
            run = 0
            while y + run < search_to and means[y + run] < 14 and stds[y + run] < 6:
                run += 1
            if run >= 16:
                gap_start = y
                gap_end = y + run
                break
        y += 1

    if gap_start is None or gap_end is None:
        return im
    if gap_end >= h or stds[gap_end] < 8:
        return im

    top_part = im.crop((0, 0, w, gap_start))
    bottom_part = im.crop((0, gap_end, w, h))
    out = Image.new("RGBA", (w, gap_start + bottom_part.height), (0, 0, 0, 0))
    out.paste(top_part, (0, 0))
    out.paste(bottom_part, (0, gap_start))
    return out


def android_bottom_chrome_height(screenshot: Image.Image) -> int:
    """Detect Android nav (+ optional light gap above sheets) to crop from bottom."""
    rgb = screenshot.convert("RGB")
    arr = np.asarray(rgb).astype(np.float32)
    h, _w, _c = arr.shape
    means = arr.mean(axis=(1, 2))
    stds = arr.std(axis=(1, 2))
    y = h - 1
    floor = int(h * 0.72)

    # Phase 1 — bright flat system nav / gesture bar
    while y > floor and means[y] > 215 and stds[y] < 40:
        y -= 1

    # Phase 2 — short flat light strip between dark UI sheets and the nav
    strip_start = y
    y2 = y
    while y2 > floor and means[y2] > 140 and stds[y2] < 28:
        y2 -= 1
    strip_h = strip_start - y2
    # Confirm dark sheet/UI sits above the strip (allow mid-tone transition rows)
    above = float(means[max(0, y2 - 8) : max(1, y2 + 1)].mean()) if y2 > 0 else 255
    if 12 <= strip_h <= 130 and above < 100:
        y = max(0, y2 - 4)

    cropped = (h - 1 - y) + 16  # small pad past the seam
    return int(min(max(cropped, int(h * 0.055)), int(h * 0.16)))


def crop_android_chrome(screenshot: Image.Image) -> Image.Image:
    """Strip Android nav chrome; keep status bar for phone_frame island cover."""
    im = ensure_rgba(screenshot)
    w, h = im.size
    bottom = android_bottom_chrome_height(im)
    cropped = im.crop((0, 0, w, h - bottom))
    # Normalize to a modern phone aspect so the shot fills the bezel (no corner voids)
    target_ar = 9 / 19.5
    cw, ch = cropped.size
    cur_ar = cw / ch
    if cur_ar > target_ar:
        nw = int(ch * target_ar)
        x0 = (cw - nw) // 2
        cropped = cropped.crop((x0, 0, x0 + nw, ch))
    elif cur_ar < target_ar:
        nh = int(cw / target_ar)
        y0 = (ch - nh) // 2
        cropped = cropped.crop((0, y0, cw, y0 + nh))
    return cropped


def fit_android_to_iphone_frame(
    screenshot: Image.Image,
    fill: tuple[int, int, int] = (10, 10, 15),
    top_safe: float = 0.055,
) -> Image.Image:
    """Cover-fit Android screencaps into iPhone aspect — edge-to-edge, no letterbox.

    Strips Android chrome, scales with COVER into 9:19.5, then gently darkens
    a top band so the Dynamic Island sits cleanly without eating titles.
    """
    im = ensure_rgba(screenshot)
    w, h = im.size
    # Trim Android status icons; app header stays — island contrast via soft darken
    top = max(72, int(h * 0.038))
    bottom = android_bottom_chrome_height(im)
    im = im.crop((0, top, w, h - bottom))

    # COVER into phone aspect — no empty bars
    target_ar = 9 / 19.5
    cw, ch = im.size
    tw = cw
    th = max(1, int(round(cw / target_ar)))
    scale = max(tw / cw, th / ch)
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x0 = max(0, (nw - tw) // 2)
    # Prefer top of UI (headers); only shift down if we have surplus height
    y0 = 0
    surplus = nh - th
    if surplus > 0:
        y0 = min(int(surplus * 0.12), surplus)
    im = im.crop((x0, y0, x0 + tw, y0 + th))

    # Soft darken top band (island sits here) — keep camera texture, no solid bar
    rgb = im.convert("RGB")
    if top_safe > 0:
        arr = np.asarray(rgb).astype(np.float32)
        band = max(40, int(th * top_safe))
        for y in range(band):
            # stronger near top, fade to 0
            t = 1.0 - (y / max(1, band - 1))
            fade = 0.48 * (t ** 1.35)
            arr[y] = arr[y] * (1.0 - fade)
        rgb = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.1)
    return rgb.convert("RGBA")


def build_realtag() -> None:
    """RealTag — live captures: auto-detect, manual SAM mask, tag form, tag list."""
    print("RealTag")
    dest = OUT / "realtag"
    tmp = ROOT / ".tmp-shots" / "realtag"
    dark = (10, 10, 15)

    def load(name: str, top_safe: float = 0.055) -> Image.Image:
        return fit_android_to_iphone_frame(
            Image.open(tmp / name), fill=dark, top_safe=top_safe
        )

    detect = load("01-detect.png", 0.06)
    manual = load("02-manual.png", 0.06)
    form = load("03-tag-form.png", 0.05)
    tags = load("04-tag-list.png", 0.05)
    cafe = load("06-detect-cafe.png", 0.055)
    tint = (108, 92, 231)  # RealTag primary purple
    plates = [
        # Hero — detect + manual mask
        compose_dual_phones(
            detect,
            manual,
            tint=tint,
            studio=True,
            gap=80,
            angle=1.1,
            max_h=1020,
            margin=36,
            clean_notifications=False,
            # RealTag is an Android app whose own header sits at the very top of
            # the screen; a drawn island lands straight on the title.
            draw_island=False,
        ),
        # Details — tag form/list + cafe detect (no dining/food plate)
        compose_dual_phones(
            form,
            tags,
            tint=tint,
            studio=True,
            gap=80,
            angle=1.1,
            max_h=1020,
            margin=36,
            clean_notifications=False,
            # RealTag is an Android app whose own header sits at the very top of
            # the screen; a drawn island lands straight on the title.
            draw_island=False,
        ),
        compose_plate(
            phone_frame(cafe, max_h=1120, max_w=520, clean_notifications=False),
            tint=tint,
            studio=True,
        ),
    ]
    save_set(dest, plates)



def build_decidr() -> None:
    """Decidr — web SaaS decision workspace (seeded UI captures)."""
    print("Decidr")
    dest = OUT / "decidr"
    tmp = ROOT / ".tmp-shots" / "decidr"
    tint = (245, 158, 11)  # Decidr amber

    def web(name: str) -> Image.Image:
        return Image.open(tmp / name)

    def mob(name: str) -> Image.Image:
        """Normalize mobile web capture to phone aspect so it fills bezels."""
        im = ensure_rgba(Image.open(tmp / name))
        target_ar = 9 / 19.5
        w, h = im.size
        cur = w / h
        fill = (15, 15, 18, 255)
        if cur > target_ar + 0.02:
            nw = int(h * target_ar)
            x0 = (w - nw) // 2
            im = im.crop((x0, 0, x0 + nw, h))
        elif cur < target_ar - 0.02:
            nh = int(w / target_ar)
            # Prefer top of dashboard (stats + first cards)
            canvas = Image.new("RGBA", (w, nh), fill)
            canvas.paste(im, (0, 0), im)
            im = canvas
        return im

    landing = web("01-landing-desktop.png")
    dash = web("02-dashboard-desktop.png")
    detail = web("03-detail-desktop.png")
    compare = web("04-compare-desktop.png")
    wizard = web("05-new-desktop.png")
    dash_m = mob("06-dashboard-mobile.png")
    detail_m = mob("07-detail-mobile.png")
    compare_m = mob("08-compare-mobile.png")
    wizard_m = mob("09-new-mobile.png")

    plates = [
        # Hero: marketing website on laptop (web product signal for work-grid thumb)
        compose_plate(
            browser_in_laptop(
                crop_at_section_boundary(landing), screen_w=1280, fit="hero"
            ),
            tint=tint,
            studio=True,
            offset_y=4,
        ),
        # Desktop workspace + mobile
        compose_laptop_phone(dash, dash_m, tint=tint, studio=True),
        # CRM decision detail with charts
        compose_laptop_phone(
            detail, detail_m, tint=tint, studio=True, phone_side="left"
        ),
        # Compare + new-decision wizard
        compose_dual_phones(
            compare_m,
            wizard_m,
            tint=tint,
            studio=True,
            gap=100,
            angle=1.3,
            max_h=900,
            margin=52,
            clean_notifications=False,
        ),
    ]
    save_set(dest, plates)


def build_catchat() -> None:
    """CatChat plates from real product shots in .tmp-shots/catchat/.

    Drop your own filled chat captures here (same filenames), then re-run:
      python3 scripts/generate-mockups.py catchat

    Expected files:
      01-home-desktop.png      desktop companion grid (1440×900+)
      02-cat-modal.png         desktop character modal
      04-chat-active.png       desktop chat with list + thread filled
      05-home-mobile.png       mobile companion grid
      06-cat-modal-mobile.png  mobile character modal
      07-chat-mobile.png       mobile active thread (filled)
      08-chat-list-mobile.png  mobile Your Chats list (several convos)
    """
    print("CatChat")
    dest = OUT / "catchat"
    tmp = ROOT / ".tmp-shots" / "catchat"
    home = Image.open(tmp / "01-home-desktop.png")
    modal = Image.open(tmp / "02-cat-modal.png")
    # Prefer filled chat when you’ve dropped it in; fall back to empty real capture
    chat_path = tmp / "04-chat-active.png"
    if not chat_path.exists():
        chat_path = tmp / "03-chat-empty.png"
    chat = Image.open(chat_path)
    home_m = Image.open(tmp / "05-home-mobile.png")
    modal_m = Image.open(tmp / "06-cat-modal-mobile.png")
    chat_m = Image.open(tmp / "07-chat-mobile.png") if (tmp / "07-chat-mobile.png").exists() else home_m
    chat_list_m = (
        Image.open(tmp / "08-chat-list-mobile.png")
        if (tmp / "08-chat-list-mobile.png").exists()
        else chat_m
    )
    tint = (139, 92, 246)
    # Use filled chat plates only when 04 is a real new capture (not a copy of empty).
    use_chat = (tmp / "04-chat-active.png").exists() and (tmp / "03-chat-empty.png").exists() and (
        (tmp / "04-chat-active.png").read_bytes() != (tmp / "03-chat-empty.png").read_bytes()
    )
    if use_chat and (tmp / "07-chat-mobile.png").exists() and (tmp / "08-chat-list-mobile.png").exists():
        plates = [
            compose_phone_leading(chat_m, home, tint=tint, studio=True),
            compose_laptop_phone(modal, modal_m, tint=tint, phone_side="left", studio=True),
            compose_laptop_phone(chat, chat_list_m, tint=tint, studio=True),
        ]
    else:
        # Real captures only (no mock chat UI)
        plates = [
            compose_phone_leading(home_m, home, tint=tint, studio=True),
            compose_laptop_phone(modal, modal_m, tint=tint, phone_side="left", studio=True),
            compose_laptop_phone(home, modal_m, tint=tint, studio=True),
        ]
    save_set(dest, plates)


def build_agenticly() -> None:
    """Agenticly — AppScreen-only plates (no Pillow composition).

    Source of truth: `.tmp-shots/agenticly/appscreen/plates/{hero,detail-1,detail-2}.png`
    exported from AppScreen MCP at 1600×1200. This builder only converts/copies.
    """
    print("Agenticly (AppScreen plates)")
    dest = OUT / "agenticly"
    plates = ROOT / ".tmp-shots" / "agenticly" / "appscreen" / "plates"
    dest.mkdir(parents=True, exist_ok=True)
    for name in ("hero", "detail-1", "detail-2"):
        src = plates / f"{name}.png"
        if not src.exists():
            raise FileNotFoundError(
                f"Missing AppScreen plate {src} — export from AppScreen MCP first"
            )
        im = Image.open(src).convert("RGB")
        for out_name in (f"{name}.jpg", f"plate-{name}.jpg"):
            out = dest / out_name
            im.save(out, "JPEG", quality=90, optimize=True)
            print(f"  → {out.relative_to(ROOT)} ({im.width}×{im.height})")


def fit_kitty_nip_screen(screenshot: Image.Image) -> Image.Image:
    """Prep Kitty Nip App Store shots for modern iPhone frames.

    Store assets are older ~9:16 simulator captures. Strip the status bar, then
    width-fit into 9:19.5 with top/bottom pads (never crop nav or CTAs). Island
    chrome uses brand purple / white — not sampled photo colors.
    """
    im = ensure_rgba(screenshot)
    w, h = im.size
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    means = arr.mean(axis=(1, 2))
    stds = arr.std(axis=(1, 2))

    # Strip classic iOS status bar
    top = 0
    while top < int(h * 0.055):
        if stds[top] < 30 and (
            means[top] > 220 or means[top] < 55 or 85 < means[top] < 165
        ):
            top += 1
            continue
        break
    top = max(int(h * 0.030), min(top + 2, int(h * 0.055)))
    im = im.crop((0, top, w, h))
    cw, ch = im.size

    target_ar = 9 / 19.5  # width / height
    th = max(ch, int(round(cw / target_ar)))
    pad_total = max(0, th - ch)

    brand = (122, 74, 196)
    white = (252, 252, 252)
    band = np.asarray(im.convert("RGB"))[: max(6, ch // 50), :, :]
    band_mean = band.reshape(-1, 3).mean(axis=0)
    r, g, b = (float(x) for x in band_mean)
    if r > 230 and g > 230 and b > 230:
        top_fill = white
    elif b > r + 20 and b > g + 10 and 70 < b < 210:
        top_fill = brand
    else:
        top_fill = brand  # photo tops → brand island chrome, never fur tones

    bot_band = np.asarray(im.convert("RGB"))[-max(8, ch // 40) :, :, :]
    bot_mean = bot_band.reshape(-1, 3).mean(axis=0)
    bot_fill = brand if bot_mean[2] > bot_mean[0] + 15 and bot_mean[2] > 80 else top_fill

    island = max(58, int(th * 0.052))
    if pad_total <= island:
        pad_top, pad_bot = pad_total, 0
    else:
        pad_top = max(island, int(pad_total * 0.55))
        pad_bot = pad_total - pad_top

    out = Image.new("RGBA", (cw, th), (*top_fill, 255))
    if pad_bot > 0:
        ImageDraw.Draw(out).rectangle((0, th - pad_bot, cw, th), fill=(*bot_fill, 255))
    out.paste(ensure_rgba(im), (0, pad_top))

    rgb = ImageEnhance.Contrast(out.convert("RGB")).enhance(1.06)
    rgb = ImageEnhance.Color(rgb).enhance(1.12)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.1)
    return rgb.convert("RGBA")


def _knockout_promo_bg(
    im: Image.Image,
    *,
    white_thresh: int = 245,
    gray_lo: int = 55,
    gray_hi: int = 95,
) -> Image.Image:
    """Make flat store-creative backdrops transparent so phones float on studio."""
    rgba = ensure_rgba(im)
    arr = np.asarray(rgba).copy()
    rgb = arr[:, :, :3].astype(np.int16)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    # Near-white paper / page
    white = (mn > white_thresh) & ((mx - mn) < 18)
    # Flat mid-gray marketing backdrop (Kitty Nip store hero)
    gray = (
        (np.abs(r.astype(np.int16) - g) < 12)
        & (np.abs(g.astype(np.int16) - b) < 12)
        & (mn > gray_lo)
        & (mx < gray_hi + 40)
        & ((mx - mn) < 14)
    )
    # Only knock out from edges inward a bit — protect UI grays via flood from border
    h, w = white.shape
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    kill = (white | gray) & border
    # Simple flood fill from border through white/gray
    mask = white | gray
    from collections import deque

    q: deque[tuple[int, int]] = deque()
    visited = np.zeros((h, w), dtype=bool)
    ys, xs = np.where(border & mask)
    for y, x in zip(ys.tolist(), xs.tolist()):
        q.append((y, x))
        visited[y, x] = True
    while q:
        y, x = q.popleft()
        kill[y, x] = True
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and mask[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))
    arr[kill, 3] = 0
    return Image.fromarray(arr, "RGBA")


def _kitty_promo_plate(im: Image.Image, tint: tuple[int, int, int], max_w: int = 1080) -> Image.Image:
    """Drop a store promo graphic onto a richer purple studio plate."""
    shot = _knockout_promo_bg(ensure_rgba(im))
    # Trim transparent margins
    bbox = shot.getbbox()
    if bbox:
        shot = shot.crop(bbox)
    scale = max_w / max(shot.width, 1)
    if shot.height * scale > 1080:
        scale = 1080 / shot.height
    nw = max(1, int(shot.width * scale))
    nh = max(1, int(shot.height * scale))
    shot = shot.resize((nw, nh), Image.Resampling.LANCZOS)
    rgb = ImageEnhance.Contrast(shot.convert("RGBA").convert("RGB")).enhance(1.1)
    # Re-apply alpha after enhance
    alpha = shot.split()[-1]
    rgb = ImageEnhance.Color(rgb).enhance(1.2)
    shot = rgb.convert("RGBA")
    shot.putalpha(alpha.resize(shot.size, Image.Resampling.LANCZOS))

    canvas = (1600, 1200)
    bg = make_bg(canvas, tint, studio=True, strength=0.32, cy_shift=10)
    dx = (canvas[0] - shot.width) // 2
    dy = (canvas[1] - shot.height) // 2
    paste_with_shadow(bg, shot, (dx, dy), radius=36, blur=44, opacity=110, studio=True)
    return bg.convert("RGB")


def build_sextherapypro() -> None:
    """Sex Therapy Pro — soft mist editorial plates (wellness, not charcoal studio)."""
    print("Sex Therapy Pro")
    dest = OUT / "sextherapypro"
    tmp = ROOT / ".tmp-shots" / "sextherapypro"
    tint = (130, 155, 235)

    def load(name: str) -> Image.Image:
        return Image.open(tmp / name).convert("RGBA")

    plan = load("01-plan.png")
    goals = load("03-goals.png")
    topics = patch_stp_topics(load("06-topics.png"))
    game = load("04-game.png")
    chat = load("02-chat.png")

    plates = [
        compose_wellness_hero([plan, goals, topics], tint=tint),
        compose_wellness_cascade([game, chat, goals], tint=tint),
    ]
    save_set(dest, plates)


def mist_editorial_bg(
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (130, 155, 235),
) -> Image.Image:
    """Soft lavender mist — calm wellness plate for Sex Therapy Pro."""
    w, h = canvas
    yy, xx = np.mgrid[0:h, 0:w]
    base = np.array([236, 240, 250], dtype=np.float32)
    arr = np.broadcast_to(base, (h, w, 3)).copy()
    cx, cy = w * 0.5, h * 0.35
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    wash = np.clip(1 - dist / (max(w, h) * 0.85), 0, 1) ** 1.5
    for i, c in enumerate(tint):
        arr[:, :, i] = arr[:, :, i] * (1 - wash * 0.28) + c * (wash * 0.28)
    # soft second wash bottom
    floor = np.clip((yy / h - 0.45) / 0.55, 0, 1) ** 1.2
    soft = (220, 225, 240)
    for i, c in enumerate(soft):
        arr[:, :, i] = arr[:, :, i] * (1 - floor * 0.2) + c * (floor * 0.2)
    rng = np.random.default_rng(11)
    arr = np.clip(arr + rng.normal(0, 0.8, (h, w, 1)), 0, 255)
    bg = Image.fromarray(arr.astype(np.uint8)).convert("RGBA")
    blob = Image.new("RGBA", canvas, (0, 0, 0, 0))
    ImageDraw.Draw(blob).ellipse(
        (int(w * 0.15), int(h * -0.1), int(w * 0.85), int(h * 0.55)),
        fill=(*tint, 32),
    )
    return Image.alpha_composite(bg, blob.filter(ImageFilter.GaussianBlur(120)))


def forest_editorial_bg(
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Deep forest field plate for CPAS Huddle Up — stadium night energy."""
    w, h = canvas
    yy, xx = np.mgrid[0:h, 0:w]
    base = np.array([14, 28, 22], dtype=np.float32)
    arr = np.broadcast_to(base, (h, w, 3)).copy()
    # vertical field wash
    floor = np.clip((yy / h - 0.25) / 0.75, 0, 1) ** 1.3
    mid = (22, 48, 36)
    for i, c in enumerate(mid):
        arr[:, :, i] = arr[:, :, i] * (1 - floor * 0.55) + c * (floor * 0.55)
    # key light upper center (floodlight)
    cx, cy = w * 0.5, h * 0.12
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    key = np.clip(1 - dist / (max(w, h) * 0.7), 0, 1) ** 2.0
    for i, c in enumerate(tint):
        arr[:, :, i] = arr[:, :, i] * (1 - key * 0.45) + c * (key * 0.45)
    rng = np.random.default_rng(3)
    arr = np.clip(arr + rng.normal(0, 1.0, (h, w, 1)), 0, 255)
    bg = Image.fromarray(arr.astype(np.uint8)).convert("RGBA")
    blob = Image.new("RGBA", canvas, (0, 0, 0, 0))
    ImageDraw.Draw(blob).ellipse(
        (int(w * 0.2), int(h * 0.55), int(w * 0.8), int(h * 1.15)),
        fill=(20, 80, 50, 40),
    )
    return Image.alpha_composite(bg, blob.filter(ImageFilter.GaussianBlur(90)))


def _framed_ios(shot: Image.Image, max_h: int, max_w: int = 480) -> Image.Image:
    """iOS shot → clean header chrome → phone frame (no notification wipe)."""
    return phone_frame(
        prep_ios_for_frame(shot),
        max_h=max_h,
        max_w=max_w,
        clean_notifications=False,
    )


def compose_wellness_hero(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (130, 155, 235),
) -> Image.Image:
    """Centered 3-phone cascade — fills 4:3 portfolio cards (no empty half)."""
    return compose_wellness_cascade(shots[:3], canvas=canvas, tint=tint)


def compose_wellness_cascade(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (130, 155, 235),
) -> Image.Image:
    """Dense overlapping cascade on mist — sized to fill portfolio 4:3 cards."""
    bg = mist_editorial_bg(canvas, tint)
    heights = [920, 1100, 960]
    angles = [-5.5, 0.0, 5.0]
    phones = [_framed_ios(s, max_h=heights[i], max_w=500) for i, s in enumerate(shots[:3])]
    rotated = [
        p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
        for i, p in enumerate(phones)
    ]
    gap = -80
    margin = 40
    total = sum(p.width for p in phones) + gap * 2
    scale = min(1.0, (canvas[0] - margin * 2) / max(1, total))
    # Prefer filling height too
    max_rot_h = max(r.height for r in rotated)
    scale = min(scale, (canvas[1] - 50) / max(1, max_rot_h))
    if scale < 0.999:
        phones = [
            _framed_ios(s, max_h=int(heights[i] * scale), max_w=int(500 * scale))
            for i, s in enumerate(shots[:3])
        ]
        rotated = [
            p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
            for i, p in enumerate(phones)
        ]
        gap = int(-80 * scale)

    x = margin
    xs = []
    for p in phones:
        xs.append(x)
        x += p.width + gap
    span = (xs[-1] + phones[-1].width) - xs[0]
    shift = (canvas[0] - span) // 2 - xs[0]
    xs = [v + shift for v in xs]
    ys = [
        (canvas[1] - phones[i].height) // 2 + [24, -10, 28][i] for i in range(3)
    ]
    for i, opacity in ((0, 78), (2, 82), (1, 120)):
        rx = xs[i] + (phones[i].width - rotated[i].width) // 2
        ry = ys[i] + (phones[i].height - rotated[i].height) // 2
        paste_with_shadow(bg, rotated[i], (rx, ry), radius=48, blur=34, opacity=opacity)
    return bg.convert("RGB")


def compose_wellness_tools(
    left: Image.Image,
    right: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (130, 155, 235),
) -> Image.Image:
    """Bare UI tool cards — body map + game, product-first."""
    bg = mist_editorial_bg(canvas, tint)
    a = rounded_ui_card(prep_ios_for_frame(left), max_w=520, max_h=980, radius=36)
    b = rounded_ui_card(prep_ios_for_frame(right), max_w=520, max_h=980, radius=36)
    gap = 48
    total = a.width + b.width + gap
    scale = min(1.0, (canvas[0] - 100) / total, (canvas[1] - 80) / max(a.height, b.height))
    if scale < 0.999:
        a = a.resize((int(a.width * scale), int(a.height * scale)), Image.Resampling.LANCZOS)
        b = b.resize((int(b.width * scale), int(b.height * scale)), Image.Resampling.LANCZOS)
        gap = max(24, int(48 * scale))
    x0 = (canvas[0] - (a.width + b.width + gap)) // 2
    y0 = (canvas[1] - max(a.height, b.height)) // 2
    paste_with_shadow(bg, a, (x0, y0 + (max(a.height, b.height) - a.height) // 2), radius=36, blur=32, opacity=88)
    paste_with_shadow(
        bg,
        b,
        (x0 + a.width + gap, y0 + (max(a.height, b.height) - b.height) // 2),
        radius=36,
        blur=32,
        opacity=88,
    )
    return bg.convert("RGB")


def compose_cpas_hero(
    home: Image.Image,
    room: Image.Image,
    podcast: Image.Image,
    splash: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Four-phone forest fan — fills the plate (no empty half)."""
    bg = forest_editorial_bg(canvas, tint)
    heights = [760, 980, 900, 740]
    angles = [-8.0, -1.5, 3.5, 8.5]
    max_ws = [360, 460, 420, 350]
    shots = [room, home, podcast, splash]
    phones = [
        _framed_ios(s, max_h=heights[i], max_w=max_ws[i]) for i, s in enumerate(shots)
    ]
    rotated = [
        p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
        for i, p in enumerate(phones)
    ]
    gap = -70
    margin = 36
    total = sum(p.width for p in phones) + gap * 3
    scale = min(1.0, (canvas[0] - margin * 2) / max(1, total))
    max_rot_h = max(r.height for r in rotated)
    scale = min(scale, (canvas[1] - 60) / max(1, max_rot_h))
    if scale < 0.999:
        phones = [
            _framed_ios(s, max_h=int(heights[i] * scale), max_w=int(max_ws[i] * scale))
            for i, s in enumerate(shots)
        ]
        rotated = [
            p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
            for i, p in enumerate(phones)
        ]
        gap = int(-70 * scale)

    x = margin
    xs: list[int] = []
    for p in phones:
        xs.append(x)
        x += p.width + gap
    span = (xs[-1] + phones[-1].width) - xs[0]
    shift = (canvas[0] - span) // 2 - xs[0]
    xs = [v + shift for v in xs]
    y_offs = [48, -12, 18, 56]
    ys = [(canvas[1] - phones[i].height) // 2 + y_offs[i] for i in range(4)]
    for i, opacity in ((0, 70), (3, 72), (2, 95), (1, 120)):
        rx = xs[i] + (phones[i].width - rotated[i].width) // 2
        ry = ys[i] + (phones[i].height - rotated[i].height) // 2
        paste_with_shadow(
            bg, rotated[i], (rx, ry), radius=48, blur=34, opacity=opacity, studio=True
        )
    return bg.convert("RGB")


def compose_cpas_web_hero(
    web: Image.Image,
    phone_shot: Image.Image,
    float_shot: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Coach web dashboard + phone — denser product plate."""
    bg = forest_editorial_bg(canvas, tint)
    margin = 40
    phone = _framed_ios(phone_shot, max_h=1080, max_w=500)
    angled = phone.rotate(-5.5, resample=Image.Resampling.BICUBIC, expand=True)
    browser = thin_browser_frame(trim_web_top_padding(web), screen_w=1000, fit="width")
    floater = rounded_ui_card(prep_ios_for_frame(float_shot), max_w=340, max_h=420, radius=24)

    scale = 1.0
    for _ in range(8):
        span_w = angled.width + int(browser.width * 0.62)
        span_h = max(angled.height, browser.height + 40)
        fit = min(
            (canvas[0] - margin * 2) / max(1, span_w),
            (canvas[1] - margin * 2) / max(1, span_h),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.97
        phone = _framed_ios(phone_shot, max_h=int(1080 * scale), max_w=int(500 * scale))
        angled = phone.rotate(-5.5, resample=Image.Resampling.BICUBIC, expand=True)
        browser = thin_browser_frame(
            trim_web_top_padding(web), screen_w=int(1000 * scale), fit="width"
        )
        floater = rounded_ui_card(
            prep_ios_for_frame(float_shot),
            max_w=int(340 * scale),
            max_h=int(420 * scale),
            radius=max(16, int(24 * scale)),
        )

    bx = canvas[0] - browser.width - margin - 10
    by = (canvas[1] - browser.height) // 2 - 20
    ax = margin + 10
    ay = (canvas[1] - angled.height) // 2 + 10
    fx = ax + angled.width - int(floater.width * 0.35)
    fy = ay + angled.height - floater.height - int(70 * scale)

    paste_with_shadow(bg, browser, (bx, by), radius=18, blur=36, opacity=80, studio=True)
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=40, opacity=120, studio=True)
    paste_with_shadow(bg, floater, (fx, fy), radius=24, blur=28, opacity=100, studio=True)
    return bg.convert("RGB")


def compose_cpas_livestream(
    podcast: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Single oversized livestream phone — Agora moment as spotlight."""
    bg = forest_editorial_bg(canvas, tint)
    phone = _framed_ios(podcast, max_h=1120, max_w=520)
    angled = phone.rotate(-2.5, resample=Image.Resampling.BICUBIC, expand=True)
    scale = min((canvas[0] - 120) / angled.width, (canvas[1] - 80) / angled.height, 1.0)
    if scale < 0.999:
        phone = _framed_ios(podcast, max_h=int(1120 * scale), max_w=int(520 * scale))
        angled = phone.rotate(-2.5, resample=Image.Resampling.BICUBIC, expand=True)
    dx = (canvas[0] - angled.width) // 2
    dy = (canvas[1] - angled.height) // 2
    paste_with_shadow(bg, angled, (dx, dy), radius=52, blur=46, opacity=130, studio=True)
    return bg.convert("RGB")


def compose_cpas_dual_field(
    left: Image.Image,
    right: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Two phones on forest plate — wider gap, low angles (locker-room pair)."""
    bg = forest_editorial_bg(canvas, tint)
    a = _framed_ios(left, max_h=1000)
    b = _framed_ios(right, max_h=1000)
    ra = a.rotate(-3.0, resample=Image.Resampling.BICUBIC, expand=True)
    rb = b.rotate(3.0, resample=Image.Resampling.BICUBIC, expand=True)
    gap = 100
    total = ra.width + rb.width + gap
    scale = min(1.0, (canvas[0] - 90) / total, (canvas[1] - 70) / max(ra.height, rb.height))
    if scale < 0.999:
        a = _framed_ios(left, max_h=int(1000 * scale))
        b = _framed_ios(right, max_h=int(1000 * scale))
        ra = a.rotate(-3.0, resample=Image.Resampling.BICUBIC, expand=True)
        rb = b.rotate(3.0, resample=Image.Resampling.BICUBIC, expand=True)
        gap = max(48, int(100 * scale))
    x0 = (canvas[0] - (ra.width + rb.width + gap)) // 2
    y0 = (canvas[1] - max(ra.height, rb.height)) // 2
    paste_with_shadow(bg, ra, (x0, y0), radius=48, blur=36, opacity=100, studio=True)
    paste_with_shadow(
        bg, rb, (x0 + ra.width + gap, y0 + 8), radius=48, blur=36, opacity=100, studio=True
    )
    return bg.convert("RGB")


def compose_cpas_brand_splash(
    splash: Image.Image,
    home: Image.Image,
    podcast: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Splash + home + live float — wide center-weighted cluster fills the 4:3 plate."""
    bg = forest_editorial_bg(canvas, tint)
    splash_card = rounded_ui_card(prep_ios_for_frame(splash), max_w=400, max_h=900, radius=36)
    phone = _framed_ios(home, max_h=1180, max_w=540)
    angled = phone.rotate(3.5, resample=Image.Resampling.BICUBIC, expand=True)
    floater = rounded_ui_card(prep_ios_for_frame(podcast), max_w=400, max_h=520, radius=24)
    # Span nearly full width: splash peek + phone body + floater peek
    span = splash_card.width * 0.55 + angled.width * 0.78 + floater.width * 0.55
    scale = min(
        1.0,
        (canvas[0] - 56) / span,
        (canvas[1] - 36) / max(splash_card.height, angled.height),
    )
    if scale < 0.999:
        splash_card = rounded_ui_card(
            prep_ios_for_frame(splash), max_w=int(400 * scale), max_h=int(900 * scale), radius=28
        )
        phone = _framed_ios(home, max_h=int(1180 * scale), max_w=int(540 * scale))
        angled = phone.rotate(3.5, resample=Image.Resampling.BICUBIC, expand=True)
        floater = rounded_ui_card(
            prep_ios_for_frame(podcast),
            max_w=int(400 * scale),
            max_h=int(520 * scale),
            radius=20,
        )
        span = splash_card.width * 0.55 + angled.width * 0.78 + floater.width * 0.55
    sx = max(20, (canvas[0] - int(span)) // 2)
    sy = (canvas[1] - splash_card.height) // 2
    ax = sx + int(splash_card.width * 0.55)
    ay = (canvas[1] - angled.height) // 2
    fx = ax + int(angled.width * 0.78) - int(floater.width * 0.35)
    fy = ay + int(angled.height * 0.42)
    # Keep floater inside canvas
    fx = min(fx, canvas[0] - floater.width - 20)
    paste_with_shadow(bg, splash_card, (sx, sy), radius=36, blur=34, opacity=95, studio=True)
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=40, opacity=125, studio=True)
    paste_with_shadow(bg, floater, (fx, fy), radius=24, blur=28, opacity=110, studio=True)
    return bg.convert("RGB")


def compose_cpas_stadium(
    live: Image.Image,
    left: Image.Image,
    right: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Stadium spotlight — oversized live phone center, support phones tucked behind.

    Silhouette: one dominant vertical device (NOT phone+browser like Snapwork).
    """
    bg = forest_editorial_bg(canvas, tint)
    lead = _framed_ios(live, max_h=1120, max_w=520)
    lead_r = lead.rotate(-1.5, resample=Image.Resampling.BICUBIC, expand=True)
    a = _framed_ios(left, max_h=820, max_w=390)
    b = _framed_ios(right, max_h=820, max_w=390)
    ar = a.rotate(-11.0, resample=Image.Resampling.BICUBIC, expand=True)
    br = b.rotate(11.0, resample=Image.Resampling.BICUBIC, expand=True)

    scale = min(
        1.0,
        (canvas[0] - 80) / (ar.width * 0.45 + lead_r.width + br.width * 0.45),
        (canvas[1] - 60) / lead_r.height,
    )
    if scale < 0.999:
        lead = _framed_ios(live, max_h=int(1120 * scale), max_w=int(520 * scale))
        lead_r = lead.rotate(-1.5, resample=Image.Resampling.BICUBIC, expand=True)
        a = _framed_ios(left, max_h=int(820 * scale), max_w=int(390 * scale))
        b = _framed_ios(right, max_h=int(820 * scale), max_w=int(390 * scale))
        ar = a.rotate(-11.0, resample=Image.Resampling.BICUBIC, expand=True)
        br = b.rotate(11.0, resample=Image.Resampling.BICUBIC, expand=True)

    # Peek more of support phones — less overlap so room/explore read clearly
    lx = (canvas[0] - lead_r.width) // 2
    ly = (canvas[1] - lead_r.height) // 2
    ax = max(24, lx - int(ar.width * 0.72))
    ay = ly + int(lead_r.height * 0.08)
    bx = min(canvas[0] - br.width - 24, lx + lead_r.width - int(br.width * 0.28))
    by = ly + int(lead_r.height * 0.06)

    paste_with_shadow(bg, ar, (ax, ay), radius=44, blur=32, opacity=70, studio=True)
    paste_with_shadow(bg, br, (bx, by), radius=44, blur=32, opacity=70, studio=True)
    paste_with_shadow(bg, lead_r, (lx, ly), radius=52, blur=46, opacity=135, studio=True)
    return bg.convert("RGB")


def compose_cpas_web_only(
    web: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (34, 110, 72),
) -> Image.Image:
    """Full-bleed coach dashboard on forest — landscape silhouette, no phone."""
    bg = forest_editorial_bg(canvas, tint)
    browser = thin_browser_frame(trim_web_top_padding(web), screen_w=1380, fit="width")
    tilted = browser.rotate(0.8, resample=Image.Resampling.BICUBIC, expand=True)
    sc = min((canvas[0] - 80) / tilted.width, (canvas[1] - 80) / tilted.height, 1.0)
    if sc < 0.999:
        browser = thin_browser_frame(
            trim_web_top_padding(web), screen_w=int(1380 * sc), fit="width"
        )
        tilted = browser.rotate(0.8, resample=Image.Resampling.BICUBIC, expand=True)
    dx = (canvas[0] - tilted.width) // 2
    dy = (canvas[1] - tilted.height) // 2
    paste_with_shadow(bg, tilted, (dx, dy), radius=20, blur=42, opacity=100, studio=True)
    return bg.convert("RGB")


def build_cpas_huddle_up() -> None:
    """CPAS Huddle Up — forest stadium plates (not Snapwork's phone+browser)."""
    print("CPAS Huddle Up")
    dest = OUT / "cpas-huddle-up"
    tmp = ROOT / ".tmp-shots" / "cpas-huddle-up"
    tint = (34, 110, 72)

    def load(name: str) -> Image.Image:
        return Image.open(tmp / name).convert("RGBA")

    home = patch_cpas_home(load("01-home.jpg"))
    room = load("02-room.jpg")
    podcast = load("03-podcast.jpg")
    splash = load("04-splash.jpg")
    web = load("05-my-rooms-web.png")

    plates = [
        # Hero — stadium live + room/explore peeks (dark, phone-only ≠ Snapwork)
        compose_cpas_stadium(podcast, room, home, tint=tint),
        # Coach web full-bleed
        compose_cpas_web_only(web, tint=tint),
        # Dual field — explore + room feed
        compose_cpas_dual_field(home, room, tint=tint),
        # Splash + home + live — stadium fill (avoids empty right forest)
        compose_cpas_stadium(home, splash, podcast, tint=tint),
    ]
    save_set(dest, plates)


def warm_editorial_bg(
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (230, 165, 35),
) -> Image.Image:
    """2026 warm paper plate — soft cream + brand wash (not charcoal studio)."""
    w, h = canvas
    yy, xx = np.mgrid[0:h, 0:w]
    # warm paper base
    base = np.array([248, 244, 236], dtype=np.float32)
    arr = np.broadcast_to(base, (h, w, 3)).copy()
    # soft radial gold key from upper-left
    cx, cy = w * 0.22, h * 0.18
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    key = np.clip(1 - dist / (max(w, h) * 0.95), 0, 1) ** 1.6
    for i, c in enumerate(tint):
        arr[:, :, i] = arr[:, :, i] * (1 - key * 0.22) + c * (key * 0.22)
    # cooler shadow falloff bottom-right
    cx2, cy2 = w * 0.85, h * 0.9
    dist2 = np.sqrt((xx - cx2) ** 2 + (yy - cy2) ** 2)
    cool = np.clip(1 - dist2 / (max(w, h) * 0.7), 0, 1) ** 1.4
    cool_c = (210, 205, 198)
    for i, c in enumerate(cool_c):
        arr[:, :, i] = arr[:, :, i] * (1 - cool * 0.18) + c * (cool * 0.18)
    # fine grain
    rng = np.random.default_rng(42)
    grain = rng.normal(0, 1.2, (h, w, 1)).astype(np.float32)
    arr = np.clip(arr + grain, 0, 255)
    bg = Image.fromarray(arr.astype(np.uint8)).convert("RGBA")
    # soft gold ambient blob
    blob = Image.new("RGBA", canvas, (0, 0, 0, 0))
    ImageDraw.Draw(blob).ellipse(
        (-120, -80, int(w * 0.55), int(h * 0.55)), fill=(*tint, 28)
    )
    blob = blob.filter(ImageFilter.GaussianBlur(110))
    return Image.alpha_composite(bg, blob)


def thin_browser_frame(screenshot: Image.Image, screen_w: int = 1180, fit: str = "contain") -> Image.Image:
    """Minimal browser chrome only — no laptop deck (2026 product-as-hero)."""
    target_h = int(screen_w * 0.62)
    shot = fit_web_for_laptop(screenshot, screen_w, target_h, mode=fit)
    chrome_h = 28
    r = 18
    framed = Image.new("RGBA", (screen_w, target_h + chrome_h), (0, 0, 0, 0))
    shell = Image.new("RGBA", framed.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shell)
    sd.rounded_rectangle((0, 0, framed.width - 1, framed.height - 1), radius=r, fill=(255, 255, 255, 255))
    # hairline border
    sd.rounded_rectangle(
        (0, 0, framed.width - 1, framed.height - 1),
        radius=r,
        outline=(220, 214, 204, 255),
        width=1,
    )
    # chrome bar
    sd.rectangle((0, 0, framed.width, chrome_h), fill=(250, 248, 244, 255))
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        x = 16 + i * 16
        sd.ellipse((x, 10, x + 9, 19), fill=color)
    # address pill
    sd.rounded_rectangle((78, 8, min(340, screen_w - 20), 22), radius=7, fill=(240, 236, 228, 255))
    shell.paste(shot, (0, chrome_h), shot)
    # clip screen corners at bottom
    mask = rounded_mask(shell.size, r)
    shell.putalpha(mask)
    return shell


def rounded_ui_card(screenshot: Image.Image, max_w: int, max_h: int, radius: int = 28) -> Image.Image:
    """Bare UI panel — no device bezel. Product screenshot as a soft card."""
    shot = fill_baked_round_corners(ensure_rgba(screenshot))
    scale = min(max_w / shot.width, max_h / shot.height)
    nw = max(1, int(shot.width * scale))
    nh = max(1, int(shot.height * scale))
    shot = shot.resize((nw, nh), Image.Resampling.LANCZOS)
    # Opaque underlay so baked transparent corners don't go black
    edge = np.asarray(shot.convert("RGB").crop((0, 0, shot.width, min(8, shot.height))))
    under = tuple(int(x) for x in np.median(edge.reshape(-1, 3), axis=0))
    card = Image.new("RGBA", shot.size, (*under, 255))
    card.paste(shot, (0, 0), shot)
    card.putalpha(rounded_mask(shot.size, radius))
    return card


def compose_snapwork_hero_asymmetric(
    web: Image.Image,
    phone_shot: Image.Image,
    float_shot: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (230, 165, 35),
) -> Image.Image:
    """Phone-leading editorial: oversized phone left, thin browser rear-right, floating card."""
    bg = warm_editorial_bg(canvas, tint)
    margin = 40

    phone = _framed_ios(phone_shot, max_h=1080, max_w=500)
    angled = phone.rotate(-6.5, resample=Image.Resampling.BICUBIC, expand=True)
    browser = thin_browser_frame(web, screen_w=980, fit="width")
    floater = rounded_ui_card(prep_ios_for_frame(float_shot), max_w=340, max_h=420, radius=24)

    # Scale cluster to fit
    scale = 1.0
    for _ in range(8):
        span_w = angled.width + int(browser.width * 0.62)
        span_h = max(angled.height, browser.height + 40)
        fit = min(
            (canvas[0] - margin * 2) / max(1, span_w),
            (canvas[1] - margin * 2) / max(1, span_h),
            1.0,
        )
        if fit >= 0.995:
            break
        scale *= fit * 0.97
        phone = _framed_ios(phone_shot, max_h=int(1080 * scale), max_w=int(500 * scale))
        angled = phone.rotate(-6.5, resample=Image.Resampling.BICUBIC, expand=True)
        browser = thin_browser_frame(web, screen_w=int(980 * scale), fit="width")
        floater = rounded_ui_card(
            prep_ios_for_frame(float_shot),
            max_w=int(340 * scale),
            max_h=int(420 * scale),
            radius=max(16, int(24 * scale)),
        )

    # Place: browser rear-right, phone front-left, floater overlapping mid
    bx = canvas[0] - browser.width - margin - 20
    by = (canvas[1] - browser.height) // 2 - 30
    ax = margin + 10
    ay = (canvas[1] - angled.height) // 2 + 10
    fx = ax + angled.width - int(floater.width * 0.35)
    fy = ay + angled.height - floater.height - int(80 * scale)

    paste_with_shadow(bg, browser, (bx, by), radius=18, blur=36, opacity=70, studio=False)
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=40, opacity=100, studio=False)
    paste_with_shadow(bg, floater, (fx, fy), radius=24, blur=28, opacity=95, studio=False)
    return bg.convert("RGB")


def compose_snapwork_bento(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (230, 165, 35),
) -> Image.Image:
    """Bento mosaic of rounded UI cards — anti-grid, product-first (2026)."""
    bg = warm_editorial_bg(canvas, tint)
    # Layout: large left, tall mid, stack right
    a, b, c, d = shots[:4]
    left = rounded_ui_card(prep_ios_for_frame(a), max_w=520, max_h=980, radius=32)
    mid = rounded_ui_card(prep_ios_for_frame(b), max_w=420, max_h=720, radius=28)
    top_r = rounded_ui_card(prep_ios_for_frame(c), max_w=380, max_h=400, radius=26)
    bot_r = rounded_ui_card(prep_ios_for_frame(d), max_w=380, max_h=400, radius=26)

    gap = 28
    margin = 56
    # Center cluster
    cluster_w = left.width + gap + mid.width + gap + top_r.width
    scale = min(1.0, (canvas[0] - margin * 2) / cluster_w)
    if scale < 0.999:
        def rs(im: Image.Image) -> Image.Image:
            return im.resize(
                (max(1, int(im.width * scale)), max(1, int(im.height * scale))),
                Image.Resampling.LANCZOS,
            )

        left, mid, top_r, bot_r = rs(left), rs(mid), rs(top_r), rs(bot_r)
        gap = max(16, int(28 * scale))

    cluster_w = left.width + gap + mid.width + gap + top_r.width
    cluster_h = max(left.height, mid.height, top_r.height + gap + bot_r.height)
    x0 = (canvas[0] - cluster_w) // 2
    y0 = (canvas[1] - cluster_h) // 2

    lx, ly = x0, y0 + (cluster_h - left.height) // 2
    mx = lx + left.width + gap
    my = y0 + (cluster_h - mid.height) // 2
    rx = mx + mid.width + gap
    ry1 = y0
    ry2 = y0 + top_r.height + gap

    paste_with_shadow(bg, left, (lx, ly), radius=32, blur=30, opacity=85)
    paste_with_shadow(bg, mid, (mx, my), radius=28, blur=28, opacity=80)
    paste_with_shadow(bg, top_r, (rx, ry1), radius=26, blur=26, opacity=75)
    paste_with_shadow(bg, bot_r, (rx, ry2), radius=26, blur=26, opacity=75)
    return bg.convert("RGB")


def compose_snapwork_web_spotlight(
    web: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (230, 165, 35),
) -> Image.Image:
    """Single oversized thin-browser plate — dashboard as the hero."""
    bg = warm_editorial_bg(canvas, tint)
    browser = thin_browser_frame(web, screen_w=1320, fit="contain")
    # slight perspective tilt
    tilted = browser.rotate(1.2, resample=Image.Resampling.BICUBIC, expand=True)
    margin = 48
    scale = min(
        (canvas[0] - margin * 2) / tilted.width,
        (canvas[1] - margin * 2) / tilted.height,
        1.0,
    )
    if scale < 0.999:
        browser = thin_browser_frame(web, screen_w=int(1320 * scale), fit="contain")
        tilted = browser.rotate(1.2, resample=Image.Resampling.BICUBIC, expand=True)
    dx = (canvas[0] - tilted.width) // 2
    dy = (canvas[1] - tilted.height) // 2
    paste_with_shadow(bg, tilted, (dx, dy), radius=20, blur=42, opacity=90)
    return bg.convert("RGB")


def compose_snapwork_triple_cascade(
    shots: list[Image.Image],
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = (230, 165, 35),
) -> Image.Image:
    """Staggered cascade of three phones — depth, not a flat dual."""
    bg = warm_editorial_bg(canvas, tint)
    heights = [780, 980, 820]
    angles = [-9.0, 0.0, 7.5]
    phones = [
        _framed_ios(s, max_h=heights[i], max_w=440 if i != 1 else 480)
        for i, s in enumerate(shots[:3])
    ]
    rotated = [
        p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
        for i, p in enumerate(phones)
    ]

    # Overlap cascade left → center → right
    margin = 50
    gap = -70  # intentional overlap
    total = sum(p.width for p in phones) + gap * 2
    scale = min(1.0, (canvas[0] - margin * 2) / max(1, total + 80))
    if scale < 0.999:
        phones = [
            _framed_ios(
                s,
                max_h=int(heights[i] * scale),
                max_w=int((440 if i != 1 else 480) * scale),
            )
            for i, s in enumerate(shots[:3])
        ]
        rotated = [
            p.rotate(angles[i], resample=Image.Resampling.BICUBIC, expand=True)
            for i, p in enumerate(phones)
        ]
        gap = int(-70 * scale)

    xs_base = []
    x = margin + 40
    for i, p in enumerate(phones):
        xs_base.append(x)
        x += p.width + gap
    # Center
    span = (xs_base[-1] + phones[-1].width) - xs_base[0]
    shift = (canvas[0] - span) // 2 - xs_base[0]
    xs_base = [x + shift for x in xs_base]

    ys = []
    for i, p in enumerate(phones):
        nudge = [40, -10, 55][i]
        ys.append((canvas[1] - p.height) // 2 + nudge)

    # Draw back to front: 0, 2, then center 1
    order = [(0, 70), (2, 80), (1, 110)]
    for i, opacity in order:
        rx = xs_base[i] + (phones[i].width - rotated[i].width) // 2
        ry = ys[i] + (phones[i].height - rotated[i].height) // 2
        paste_with_shadow(
            bg,
            rotated[i],
            (rx, ry),
            radius=48,
            blur=32 if i != 1 else 40,
            opacity=opacity,
        )
    return bg.convert("RGB")


def build_snapwork() -> None:
    """Snapwork — phone-only editorial plates (no campaigns web browser)."""
    print("Snapwork")
    dest = OUT / "snapwork"
    tmp = ROOT / ".tmp-shots" / "snapwork"
    tint = (230, 165, 35)

    def load(name: str) -> Image.Image:
        return Image.open(tmp / name).convert("RGBA")

    listing = load("01-listing.png")
    connect = load("02-connect.png")
    portfolio = load("05-portfolio.png")
    publish = load("07-publish.png")
    interests = load("06-interests.png")

    plates = [
        # Hero — listing · connect · portfolio (phones only)
        compose_snapwork_triple_cascade([listing, connect, portfolio], tint=tint),
        # Publish flow cascade
        compose_snapwork_triple_cascade([publish, listing, connect], tint=tint),
        # Interests + portfolio + listing
        compose_snapwork_triple_cascade([interests, portfolio, listing], tint=tint),
        # Bento mosaic
        compose_snapwork_bento([publish, listing, connect, portfolio], tint=tint),
    ]
    save_set(dest, plates)


def build_kitty_nip() -> None:
    """Kitty Nip — polished store promo hero + punchy dual-phone plates."""
    print("Kitty Nip")
    dest = OUT / "kitty-nip"
    tmp = ROOT / ".tmp-shots" / "kittynip"
    tint = (155, 70, 220)

    def load_as(*names: str) -> Image.Image:
        for name in names:
            p = tmp / name
            if p.exists():
                return fit_kitty_nip_screen(Image.open(p))
        raise FileNotFoundError(names)

    def load_raw(*names: str) -> Image.Image:
        for name in names:
            p = tmp / name
            if p.exists():
                return Image.open(p).convert("RGBA")
        raise FileNotFoundError(names)

    promo = load_raw("screen-00.png", "04-store-screen.png")
    swipe = load_as("as-swipe.png")
    profile = load_as("as-profile.png")
    match = load_as("as-match.png")

    # Stronger studio behind dual phones
    def dual(a: Image.Image, b: Image.Image) -> Image.Image:
        return compose_dual_phones(
            a,
            b,
            tint=tint,
            studio=True,
            gap=72,
            angle=2.0,
            max_h=1040,
            margin=36,
            clean_notifications=False,
            draw_island=True,
            status_fill=(122, 74, 196),
        )

    plates = [
        # Hero — marketing promo (floating cat orbs) on purple studio
        _kitty_promo_plate(promo, tint, max_w=1040),
        # Swipe + profile detail (best App Store cat photography)
        dual(swipe, profile),
        # Match moment + swipe again for energy
        dual(match, swipe),
    ]
    save_set(dest, plates)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    import sys

    targets = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    builders = {
        "innerverse": build_innerverse,
        "qubio": build_qubio,
        "dealflow-ai": build_dealflow,
        "bschedule": build_bschedule,
        "bugmapper": build_bugmapper,
        "interio": build_interio,
        "safedeal": build_safedeal,
        "catchat": build_catchat,
        "meet-and-greet": build_meet_and_greet,
        "realtag": build_realtag,
        "decidr": build_decidr,
        "agenticly": build_agenticly,
        "kitty-nip": build_kitty_nip,
        "sextherapypro": build_sextherapypro,
        "cpas-huddle-up": build_cpas_huddle_up,
        "snapwork": build_snapwork,
    }
    for name, fn in builders.items():
        if targets is None or name in targets:
            fn()
    print("Done.")


if __name__ == "__main__":
    main()
