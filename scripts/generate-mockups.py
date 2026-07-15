#!/usr/bin/env python3
"""Compose portfolio mockups from Desktop/Screenshots into public/images/projects."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

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
) -> Image.Image:
    a = phone_frame(left, max_h=900)
    b = phone_frame(right, max_h=900)
    bg = make_bg(canvas, tint, studio, strength=0.18 if studio else 0.14)
    # Measure rotated bounds so gap stays clear after tilt.
    ra = a.rotate(-angle, resample=Image.Resampling.BICUBIC, expand=True)
    rb = b.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    total_w = ra.width + rb.width + gap
    x0 = (canvas[0] - total_w) // 2
    y0 = (canvas[1] - max(ra.height, rb.height)) // 2 + 16

    placements = (
        (ra, x0, y0),
        (rb, x0 + ra.width + gap, y0 + 12),
    )
    for device, dx, dy in placements:
        paste_with_shadow(bg, device, (dx, dy), radius=48, blur=34, opacity=85, studio=studio)
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


def compose_laptop_phone(
    web: Image.Image,
    mobile: Image.Image,
    canvas: tuple[int, int] = (1600, 1200),
    tint: tuple[int, int, int] = ACCENT,
    phone_side: str = "right",
    studio: bool = False,
) -> Image.Image:
    """Classic laptop + overlapping phone hero."""
    laptop = browser_in_laptop(web, screen_w=1080)
    phone = phone_frame(mobile, max_h=820)

    bg = make_bg(canvas, tint, studio, strength=0.2 if studio else 0.15, cy_shift=60)

    lx = (canvas[0] - laptop.width) // 2 - 70
    ly = (canvas[1] - laptop.height) // 2 - 10
    paste_with_shadow(bg, laptop, (lx, ly), radius=16, blur=42, opacity=100, studio=studio)

    if phone_side == "right":
        px = lx + laptop.width - int(phone.width * 0.55)
        py = ly + laptop.height - int(phone.height * 0.88)
    else:
        px = lx - int(phone.width * 0.35)
        py = ly + laptop.height - int(phone.height * 0.88)

    px = max(24, min(px, canvas[0] - phone.width - 24))
    py = max(40, min(py, canvas[1] - phone.height - 24))

    angled = phone.rotate(6 if phone_side == "right" else -6, resample=Image.Resampling.BICUBIC, expand=True)
    ax = px + (phone.width - angled.width) // 2
    ay = py + (phone.height - angled.height) // 2
    paste_with_shadow(bg, angled, (ax, ay), radius=48, blur=34, opacity=100, studio=studio)
    return bg.convert("RGB")


def phone_frame(screenshot: Image.Image, max_h: int = 980) -> Image.Image:
    shot = ensure_rgba(screenshot)
    scale = max_h / shot.height
    if shot.width * scale > 460:
        scale = 460 / shot.width
    shot = shot.resize(
        (max(1, int(shot.width * scale)), max(1, int(shot.height * scale))),
        Image.Resampling.LANCZOS,
    )

    bezel = 16
    radius = 52
    screen_r = 38
    w = shot.width + bezel * 2
    h = shot.height + bezel * 2
    device = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(device)

    # outer shell
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=(32, 34, 36, 255))
    draw.rounded_rectangle((2, 2, w - 3, h - 3), radius=radius - 2, fill=(14, 15, 17, 255))

    # screen
    screen = Image.new("RGBA", shot.size, (0, 0, 0, 0))
    screen.paste(shot, (0, 0))
    screen.putalpha(rounded_mask(shot.size, screen_r))
    device.paste(screen, (bezel, bezel), screen)

    # dynamic island
    island_w, island_h = int(w * 0.28), 18
    ix = (w - island_w) // 2
    draw.rounded_rectangle((ix, 18, ix + island_w, 18 + island_h), radius=10, fill=(8, 8, 10, 230))

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


def browser_in_laptop(screenshot: Image.Image, screen_w: int = 1100) -> Image.Image:
    """Wrap a screenshot in minimal browser chrome, then a laptop shell."""
    shot = ensure_rgba(screenshot)
    # Normalize to wide aspect before chrome
    target_h = int(screen_w * 0.62)
    # Cover-fit crop to 16:10-ish
    sw, sh = shot.size
    target_aspect = screen_w / target_h
    src_aspect = sw / sh
    if src_aspect > target_aspect:
        new_w = int(sh * target_aspect)
        left = (sw - new_w) // 2
        shot = shot.crop((left, 0, left + new_w, sh))
    else:
        new_h = int(sw / target_aspect)
        top = int((sh - new_h) * 0.15)
        shot = shot.crop((0, top, sw, top + new_h))
    shot = shot.resize((screen_w, target_h), Image.Resampling.LANCZOS)

    chrome_h = 36
    framed = Image.new("RGBA", (screen_w, target_h + chrome_h), (250, 248, 243, 255))
    draw = ImageDraw.Draw(framed)
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        x = 14 + i * 16
        draw.ellipse((x, 12, x + 9, 21), fill=color)
    draw.rounded_rectangle((70, 9, screen_w - 14, 27), radius=7, fill=(255, 255, 255, 255))
    draw.rounded_rectangle((70, 9, screen_w - 14, 27), radius=7, outline=(220, 214, 200, 255))
    framed.paste(shot, (0, chrome_h))
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
    for old in dest.glob("*.png"):
        old.unlink()
    for old in dest.glob("*.jpg"):
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
    return im.crop((int(w * 0.14), int(h * 0.14), int(w * 0.86), int(h * 0.96)))


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
    feature = open_shot("Innerverse", "feature-graphic.png")
    # Complete store mockups — screens already correctly inside phones.
    mood = open_shot("Innerverse", "screenshot-2.png")
    cosmos = open_shot("Innerverse", "screenshot-3.png")
    trends = open_shot("Innerverse", "screenshot-4.png")
    archive = open_shot("Innerverse", "screenshot-7.png")
    tint = (140, 100, 180)

    save_set(
        dest,
        [
            fit_on_plate(feature, tint=tint, studio=True, pad=0.08),
            compose_device_shots([mood, cosmos], tint=tint, studio=True, max_h=1120),
            compose_device_shots([trends, archive], tint=tint, studio=True, max_h=1120),
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
    files = sorted((SHOTS / "Bugmapper-new").glob("*.png"))
    picks = [files[i] for i in [0, 6, 14, 18] if i < len(files)]
    crops = [crop_phone_from_desktop(Image.open(f)) for f in picks]
    phones = [c for c in crops if c.height > c.width * 1.35]
    tint = (40, 120, 90)
    if len(phones) >= 3:
        save_set(
            dest,
            [
                compose_triple_phones(phones[:3], tint=tint),
                compose_dual_phones(phones[0], phones[1], tint=tint),
                compose_plate(phone_frame(phones[2]), tint=tint),
            ],
        )
    elif len(phones) >= 2:
        save_set(
            dest,
            [
                compose_dual_phones(phones[0], phones[1], tint=tint),
                compose_plate(phone_frame(phones[0]), tint=tint),
                compose_plate(phone_frame(phones[1]), tint=tint),
            ],
        )


def build_interio() -> None:
    print("Interio")
    dest = OUT / "interio"
    home = open_shot("Interio", "01-home.png")
    scan = open_shot("Interio", "04-camera-detected.png")
    post = open_shot("Interio", "05-post-scan.png")
    ar = open_shot("Interio", "06-ar.png")
    tint = (95, 135, 110)
    # Real device captures: Home | Detection, Recommendations, AR
    save_set(
        dest,
        [
            compose_dual_phones(home, scan, tint=tint, gap=110, angle=1.5),
            compose_plate(phone_frame(post, max_h=980), tint=tint),
            compose_plate(phone_frame(ar, max_h=980), tint=tint),
        ],
    )


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
    }
    for name, fn in builders.items():
        if targets is None or name in targets:
            fn()
    print("Done.")


if __name__ == "__main__":
    main()
