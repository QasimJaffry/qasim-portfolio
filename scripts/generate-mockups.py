#!/usr/bin/env python3
"""Compose portfolio mockups from Desktop/Screenshots into public/images/projects."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SHOTS = Path.home() / "Desktop" / "Screenshots"
OUT = ROOT / "public" / "images" / "projects"

BG = (247, 245, 239)
SURFACE = (236, 230, 216)
ACCENT = (15, 138, 124)

# Dark studio plate — used for AI projects
STUDIO_BG = (18, 20, 23)
STUDIO_MID = (28, 32, 36)
STUDIO_RIM = (48, 56, 62)


def ensure_rgba(im: Image.Image) -> Image.Image:
    return im.convert("RGBA") if im.mode != "RGBA" else im


def clean_status_bar_notifications(
    screenshot: Image.Image, bar_h: int | None = None
) -> Image.Image:
    """Wipe Android status-bar app notification icons; keep time + system cluster."""
    im = ensure_rgba(screenshot).copy()
    w, h = im.size
    if bar_h is None:
        bar_h = max(88, int(h * 0.048))
    # Sample clean bar fill from under the clock / left padding
    sample = im.crop((4, 4, min(60, w // 10), min(bar_h - 6, 36)))
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
    ImageDraw.Draw(im).rectangle((left, 0, right, bar_h), fill=(r, g, b, a))
    return im


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def gradient_bg(
    size: tuple[int, int],
    tint: tuple[int, int, int] = ACCENT,
    strength: float = 0.14,
    studio: bool = False,
) -> Image.Image:
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w]

    if studio:
        # Charcoal base with cool rim light + tinted key light
        arr = np.full((h, w, 3), STUDIO_BG, dtype=np.float32)
        # vertical floor wash
        floor = np.clip((yy / h - 0.35) / 0.65, 0, 1) ** 1.4
        for i, c in enumerate(STUDIO_MID):
            arr[:, :, i] = arr[:, :, i] * (1 - floor * 0.55) + c * (floor * 0.55)
        # key light from upper right
        cx, cy = w * 0.68, h * 0.18
        dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        key = np.clip(1 - dist / (max(w, h) * 0.75), 0, 1) ** 1.8
        key_mix = key * (strength + 0.1)
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
) -> Image.Image:
    bg = gradient_bg(canvas, tint=tint, strength=strength, studio=studio)
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
        )
        b = phone_frame(
            right,
            max_h=h,
            clean_notifications=clean_notifications,
            status_fill=status_fill,
            draw_island=draw_island,
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

    bg = make_bg(canvas, tint, studio, strength=0.18 if studio else 0.14)
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
) -> Image.Image:
    phones = [phone_frame(s, max_h=880 if i == 1 else 780) for i, s in enumerate(shots[:3])]
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
) -> Image.Image:
    """BSchedule-style fan, four phones — fully in-frame (no edge clip)."""
    margin = 52
    heights = [620, 700, 780, 620]
    max_ws = [330, 350, 380, 330]
    angles = [-6.5, -2.2, 2.2, 6.5]
    side_gap = -6  # light tuck — fan look without hiding half the UI
    y_nudge = [28, 12, 2, 28]

    def build(scale: float):
        phones = [
            phone_frame(
                s,
                max_h=max(1, int(heights[i] * scale)),
                max_w=max(1, int(max_ws[i] * scale)),
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
) -> Image.Image:
    """Laptop + phone — both fully visible with safe margins."""
    margin = 48
    # Keep laptop a bit smaller so the overlapping phone never clips the plate.
    laptop = browser_in_laptop(web, screen_w=1040, fit=web_fit)
    phone = phone_frame(mobile, max_h=760)
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
        phone = phone_frame(mobile, max_h=int(760 * scale))
        angled = phone.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    bg = make_bg(canvas, tint, studio, strength=0.2 if studio else 0.15, cy_shift=60)

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


def compose_phone_leading(
    mobile: Image.Image,
    web: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    studio: bool = False,
) -> Image.Image:
    """Phone-first product story: large phone left, laptop tucked right (different from laptop-led heroes)."""
    margin = 44
    phone = phone_frame(mobile, max_h=980)
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
        phone = phone_frame(mobile, max_h=int(980 * scale))
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


def phone_frame(
    screenshot: Image.Image,
    max_h: int = 980,
    max_w: int = 460,
    clean_notifications: bool = True,
    status_fill: tuple[int, int, int] | None = None,
    draw_island: bool = True,
) -> Image.Image:
    shot = ensure_rgba(screenshot)
    if clean_notifications:
        shot = clean_status_bar_notifications(shot)
    if status_fill is not None:
        # Solid status strip so Dynamic Island sits on clean chrome (no gray wipe artifacts)
        w, h = shot.size
        bar = max(70, int(h * 0.042))
        ImageDraw.Draw(shot).rectangle((0, 0, w, bar), fill=(*status_fill, 255))
    scale = max_h / shot.height
    if shot.width * scale > max_w:
        scale = max_w / shot.width
    shot = shot.resize(
        (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
        Image.Resampling.LANCZOS,
    )

    bezel = 14
    radius = 54
    # Match inner bezel curve tightly so content fills corners
    screen_r = max(36, radius - bezel + 2)
    w = shot.width + bezel * 2
    h = shot.height + bezel * 2
    device = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)

    # outer shell
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=(32, 34, 36, 255))
    draw.rounded_rectangle((2, 2, w - 3, h - 3), radius=radius - 2, fill=(14, 15, 17, 255))

    # screen — full bleed into rounded inset
    screen = Image.new("RGBA", shot.size, (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, screen_r))
    device.paste(screen, (bezel, bezel), screen)

    # dynamic island — optional (skip for Android captures that keep their status bar)
    if draw_island:
        island_w, island_h = int(w * 0.30), 20
        ix = (w - island_w) // 2
        draw.rounded_rectangle(
            (ix, 16, ix + island_w, 16 + island_h), radius=10, fill=(6, 6, 8, 255)
        )

    # side buttons
    draw.rounded_rectangle((-3, int(h * 0.18), 2, int(h * 0.24)), radius=2, fill=(55, 58, 60, 255))
    draw.rounded_rectangle((-3, int(h * 0.28), 2, int(h * 0.40)), radius=2, fill=(55, 58, 60, 255))
    draw.rounded_rectangle((w - 3, int(h * 0.30), w + 2, int(h * 0.42)), radius=2, fill=(55, 58, 60, 255))
    return device


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

    if mode == "fullpage":
        # Entire long page → fill laptop screen (non-uniform scale).
        # Prefer this over contain for very tall full-page captures, which
        # otherwise become an unreadable thin ribbon with huge side gaps.
        return shot.resize((screen_w, target_h), Image.Resampling.LANCZOS)

    scale = screen_w / sw
    new_h = max(1, int(sh * scale))
    shot = shot.resize((screen_w, new_h), Image.Resampling.LANCZOS)
    if new_h >= target_h:
        # Prefer top of page (logo + hero / section start)
        shot = shot.crop((0, 0, screen_w, target_h))
    else:
        canvas = Image.new("RGBA", (screen_w, target_h), (255, 255, 255, 255))
        canvas.paste(shot, (0, 0), shot)
        shot = canvas
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
    # Keep header + bottom nav; pad so content clears island + chin in phone_frame
    screen = im.crop((int(w * 0.195), int(h * 0.215), int(w * 0.805), int(h * 0.985)))
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
    web = open_shot("Qubio", "Web", "WebDesktop.png")
    tint = (122, 82, 214)
    save_set(
        dest,
        [
            compose_laptop_phone(web, home, tint=tint),
            compose_dual_phones(home, qr, tint=tint),
            compose_plate(browser_in_laptop(web, screen_w=1180), tint=tint, offset_y=8),
            compose_plate(phone_frame(pages, max_h=960), tint=tint),
        ],
    )


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
        ),
        compose_plate(
            phone_frame(cafe, max_h=1120, max_w=520, clean_notifications=False),
            tint=tint,
            studio=True,
        ),
    ]
    save_set(dest, plates)



def build_decidr() -> None:
    """Decidr — web SaaS decision workspace (seeded demo captures)."""
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
            browser_in_laptop(landing, screen_w=1280),
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
    """Agenticly — populated mobile screens + marketing web (agenticly.app)."""
    print("Agenticly")
    dest = OUT / "agenticly"
    tmp = ROOT / ".tmp-shots" / "agenticly"
    ss = SHOTS / "Agenticly"

    def load(name: str) -> Image.Image:
        for base in (tmp, ss):
            for ext in (".jpg", ".png", ".jpeg"):
                p = base / f"{name}{ext}"
                if p.exists():
                    return fit_android_to_iphone_frame(
                        Image.open(p), fill=(8, 8, 12), top_safe=0.05
                    )
        raise FileNotFoundError(name)

    markets = load("02-chat")  # market overview + charts
    trending = load("03-charts")
    movers = load("04-analysis")
    research = load("06-detail-a")  # AI chat + workflow
    chart_chat = load("07-detail-b")  # BTC chart in chat
    tint = (45, 180, 160)
    plates = [
        # Hero — live markets + chart answer (no empty chat)
        compose_dual_phones(
            markets,
            chart_chat,
            tint=tint,
            studio=True,
            gap=88,
            angle=1.2,
            max_h=980,
            margin=48,
            clean_notifications=False,
        ),
        compose_dual_phones(
            trending,
            movers,
            tint=tint,
            studio=True,
            gap=100,
            angle=1.3,
            max_h=920,
            margin=52,
            clean_notifications=False,
        ),
        # Web product + mobile research
        compose_laptop_phone(
            Image.open(tmp / "web-home.png"),
            research,
            tint=tint,
            studio=True,
            phone_side="right",
        ),
    ]
    save_set(dest, plates)


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
    }
    for name, fn in builders.items():
        if targets is None or name in targets:
            fn()
    print("Done.")


if __name__ == "__main__":
    main()
