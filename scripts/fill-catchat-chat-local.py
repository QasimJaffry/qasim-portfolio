#!/usr/bin/env python3
"""Fill CatChat chat screens locally by compositing onto REAL product captures.

No Firebase / network writes — only reads existing .tmp-shots PNGs.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / ".tmp-shots" / "catchat"
AV = TMP / "local-mock" / "avatars"

PURPLE = (139, 92, 246)
PURPLE_SOFT = (243, 232, 255)
PURPLE_TXT = (124, 58, 237)
TEXT = (38, 38, 38)
MUTED = (115, 115, 115)
WHITE = (255, 255, 255)
BORDER = (229, 229, 229)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def circle_avatar(path: Path, size: int) -> Image.Image:
    im = Image.open(path).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def round_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill,
    outline=None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]


def draw_ios_status_bar(im: Image.Image, time_str: str = "9:41") -> Image.Image:
    """Paint a realistic iOS status bar over the top of a mobile screenshot."""
    out = im.convert("RGBA").copy()
    w, h = out.size
    bar_h = max(48, int(h * 0.045))
    # Sample top pixels to keep page tint
    sample = out.crop((0, bar_h + 2, min(40, w), min(bar_h + 12, h)))
    pixels = list(sample.getdata())
    if pixels:
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
        fill = (r, g, b, 255)
    else:
        fill = (248, 245, 255, 255)

    draw = ImageDraw.Draw(out)
    draw.rectangle((0, 0, w, bar_h), fill=fill)

    f = font(max(15, int(bar_h * 0.42)), bold=True)
    # Time (left)
    draw.text((int(w * 0.07), int(bar_h * 0.28)), time_str, fill=(20, 20, 20, 255), font=f)

    # Right cluster: signal / wifi / battery
    rx = int(w * 0.78)
    cy = bar_h // 2
    # signal bars
    for i, bh in enumerate((6, 9, 12, 15)):
        x = rx + i * 5
        draw.rectangle((x, cy + 7 - bh, x + 3, cy + 7), fill=(20, 20, 20, 255))
    # wifi arcs
    wx = rx + 28
    for rad in (3, 6, 9):
        draw.arc((wx - rad, cy - rad - 1, wx + rad, cy + rad - 1), 210, 330, fill=(20, 20, 20, 255), width=2)
    # battery
    bx = rx + 46
    draw.rounded_rectangle((bx, cy - 6, bx + 24, cy + 6), radius=3, outline=(20, 20, 20, 255), width=2)
    draw.rectangle((bx + 2, cy - 3, bx + 18, cy + 3), fill=(20, 20, 20, 255))
    draw.rectangle((bx + 24, cy - 2, bx + 27, cy + 2), fill=(20, 20, 20, 255))
    return out


def fill_desktop_chat() -> Image.Image:
    """Composite a filled sidebar + thread onto the real empty chat capture."""
    base = Image.open(TMP / "03-chat-empty.png").convert("RGBA")
    draw = ImageDraw.Draw(base)
    W, H = base.size

    # Measured regions on 1440×900 real capture (approx)
    # Left panel content area (inside white card)
    side_x0, side_y0, side_x1, side_y1 = 48, 168, 340, 820
    # Chat thread area (below header, above composer)
    chat_x0, chat_y0, chat_x1, chat_y1 = 372, 200, 1390, 730

    # Wipe empty sidebar body (keep "Your Chats" header band)
    draw.rectangle((side_x0, 210, side_x1, side_y1), fill=WHITE)
    # Wipe empty-state / quick prompts in thread
    draw.rectangle((chat_x0, chat_y0, chat_x1, chat_y1), fill=WHITE)

    # Update conversation count under Your Chats
    draw.rectangle((64, 175, 250, 205), fill=WHITE)
    draw.text((68, 148), "Your Chats", fill=TEXT, font=font(22, bold=True))
    draw.text((68, 178), "4 conversations", fill=MUTED, font=font(14))

    convos = [
        ("sunny.jpg", "Sunny the Scratch", "3:57 PM", "*ears perk* Treats? Suddenly this window…", True),
        ("midnight.jpg", "Midnight the Regal", "3:42 PM", "*flicks ear* I allow company. Briefly.", False),
        ("cherry.jpg", "Cherry the Lazy", "2:18 PM", "*soft snore-purr* Five more minutes…", False),
        ("whiskers.jpg", "Whiskers the Chatty", "1:05 PM", "*tilts head* Tell me EVERYTHING…", False),
    ]

    y = 220
    for file, name, when, preview, active in convos:
        box = (56, y, 332, y + 72)
        if active:
            round_rect(draw, box, 12, PURPLE_SOFT, outline=(196, 181, 253), width=2)
        else:
            round_rect(draw, box, 12, WHITE)
        av = circle_avatar(AV / file, 44)
        base.paste(av, (68, y + 14), av)
        # online dot
        draw.ellipse((68 + 32, y + 46, 68 + 44, y + 58), fill=(34, 197, 94), outline=WHITE, width=2)
        draw.text((124, y + 14), name, fill=TEXT, font=font(14, bold=True))
        tw = draw.textlength(when, font=font(11))
        draw.text((320 - tw, y + 16), when, fill=MUTED, font=font(11))
        draw.text((124, y + 38), preview[:34] + ("…" if len(preview) > 34 else ""), fill=MUTED, font=font(12))
        y += 80

    # Messages in thread
    messages = [
        ("them", "sunny.jpg", "*blinks slowly* Mrr… I was watching dust motes dance. You're warmer than the windowsill though.", "3:55 PM"),
        ("me", None, "Hey — are you awake?", "3:55 PM"),
        ("them", "sunny.jpg", "*stretches* The warm patch by the window after breakfast is mine. Come sit. I'll share… maybe. *purrs*", "3:56 PM"),
        ("me", None, "What's your favorite sunny spot?", "3:56 PM"),
        ("them", "sunny.jpg", "*ears perk* Oh that one. Right here, where the light hits the sill. *tail curls*", "3:57 PM"),
        ("me", None, "Deal. I'll bring treats.", "3:57 PM"),
        ("them", "sunny.jpg", "*purrs louder* Treats? Suddenly this window has room for two.", "3:57 PM"),
    ]

    f_msg = font(15)
    f_ts = font(11)
    y = chat_y0 + 12
    max_bubble = 520
    for who, avfile, text, when in messages:
        lines = wrap(draw, text, f_msg, max_bubble - 28)
        line_h = 20
        bh = 16 + len(lines) * line_h + 18
        if who == "me":
            bw = int(max(draw.textlength(line, font=f_msg) for line in lines) + 28)
            bw = min(max(bw, 120), max_bubble)
            x1 = chat_x1 - 24
            x0 = x1 - bw
            round_rect(draw, (x0, y, x1, y + bh), 16, PURPLE)
            ty = y + 10
            for line in lines:
                draw.text((x0 + 14, ty), line, fill=WHITE, font=f_msg)
                ty += line_h
            draw.text((x1 - 8 - draw.textlength(when, font=f_ts), y + bh - 16), when, fill=(255, 255, 255, 200), font=f_ts)
        else:
            bw = int(max(draw.textlength(line, font=f_msg) for line in lines) + 28)
            bw = min(max(bw, 140), max_bubble)
            ax = chat_x0 + 8
            if avfile:
                av = circle_avatar(AV / avfile, 28)
                base.paste(av, (ax, y + bh - 28), av)
            x0 = ax + 36
            x1 = x0 + bw
            round_rect(draw, (x0, y, x1, y + bh), 16, WHITE, outline=BORDER, width=1)
            ty = y + 10
            for line in lines:
                draw.text((x0 + 14, ty), line, fill=TEXT, font=f_msg)
                ty += line_h
            draw.text((x0 + 14, y + bh - 16), when, fill=MUTED, font=f_ts)
        y += bh + 12
        if y > chat_y1 - 40:
            break

    return base.convert("RGB")


def fill_mobile_chat() -> Image.Image:
    """Build a mobile chat screen matching real CatChat chrome + iOS status bar."""
    # Start from real mobile home for accurate nav chrome, then rebuild body as chat
    home = Image.open(TMP / "05-home-mobile.png").convert("RGBA")
    w, h = home.size  # 780×1688 @2x
    out = Image.new("RGBA", (w, h), (248, 245, 255, 255))
    draw = ImageDraw.Draw(out)

    # Status bar region + nav from home (top ~140px includes status+nav roughly)
    # 05 may not have iOS status bar either — we'll paint one after.
    nav_h = 110
    out.paste(home.crop((0, 0, w, nav_h)), (0, 0))
    # Cover Sign In / Sign Up with Me button area — paint white nav bar matching product
    draw.rectangle((0, 0, w, nav_h), fill=WHITE)
    # Brand
    try:
        # reuse paw-ish mark from home crop if available
        pass
    except Exception:
        pass
    draw.text((48, 58), "Cat Chat", fill=PURPLE_TXT, font=font(28, bold=True))
    round_rect(draw, (w - 130, 52, w - 36, 92), 12, PURPLE)
    draw.text((w - 108, 60), "Me", fill=WHITE, font=font(18, bold=True))

    # Chat card
    card = (24, 130, w - 24, h - 36)
    round_rect(draw, card, 28, WHITE)
    # soft shadow simulated by border
    draw.rounded_rectangle(card, radius=28, outline=(235, 235, 245), width=2)

    # Header
    av = circle_avatar(AV / "sunny.jpg", 64)
    out.paste(av, (48, 158), av)
    draw.ellipse((48 + 48, 158 + 48, 48 + 64, 158 + 64), fill=(34, 197, 94), outline=WHITE, width=3)
    draw.text((130, 168), "Sunny the Scratch", fill=PURPLE_TXT, font=font(26, bold=True))
    draw.text((130, 204), "Social", fill=MUTED, font=font(18))
    # hamburger
    for i in range(3):
        yy = 178 + i * 10
        draw.rectangle((w - 90, yy, w - 58, yy + 4), fill=(160, 160, 170))

    draw.line((48, 250, w - 48, 250), fill=(245, 245, 245), width=2)

    # Avatar strip (other convos) — makes it obvious this isn't a single-chat product
    strip_y = 268
    for i, file in enumerate(["sunny.jpg", "midnight.jpg", "cherry.jpg", "whiskers.jpg"]):
        a = circle_avatar(AV / file, 56)
        x = 48 + i * 72
        out.paste(a, (x, strip_y), a)
        if i == 0:
            draw.ellipse((x - 3, strip_y - 3, x + 59, strip_y + 59), outline=PURPLE, width=3)
        draw.ellipse((x + 40, strip_y + 40, x + 56, strip_y + 56), fill=(34, 197, 94), outline=WHITE, width=2)

    # Messages
    messages = [
        ("them", "*blinks slowly* Mrr… dust motes, warm sill. You're nicer than the window.", "3:55 PM"),
        ("me", "Hey — favorite sunny spot?", "3:55 PM"),
        ("them", "*stretches* The patch after breakfast. Come sit. *purrs*", "3:56 PM"),
        ("me", "I'll bring treats.", "3:56 PM"),
        ("them", "*ears perk* Treats? This sill suddenly fits two.", "3:57 PM"),
        ("me", "Deal.", "3:57 PM"),
        ("them", "*tail curls* Don't be late. Sun waits for no cat… except maybe you.", "3:58 PM"),
    ]
    f_msg = font(22)
    f_ts = font(14)
    y = 350
    max_b = int(w * 0.72)
    for who, text, when in messages:
        lines = wrap(draw, text, f_msg, max_b - 36)
        bh = 20 + len(lines) * 28 + 24
        if who == "me":
            bw = int(min(max_b, max(draw.textlength(l, font=f_msg) for l in lines) + 36))
            x1 = w - 48
            x0 = x1 - bw
            round_rect(draw, (x0, y, x1, y + bh), 22, PURPLE)
            ty = y + 14
            for line in lines:
                draw.text((x0 + 18, ty), line, fill=WHITE, font=f_msg)
                ty += 28
            draw.text((x1 - 16 - draw.textlength(when, font=f_ts), y + bh - 22), when, fill=(255, 255, 255, 210), font=f_ts)
        else:
            a = circle_avatar(AV / "sunny.jpg", 36)
            out.paste(a, (48, y + bh - 36), a)
            bw = int(min(max_b, max(draw.textlength(l, font=f_msg) for l in lines) + 36))
            x0 = 96
            x1 = x0 + bw
            round_rect(draw, (x0, y, x1, y + bh), 22, WHITE, outline=BORDER, width=2)
            ty = y + 14
            for line in lines:
                draw.text((x0 + 18, ty), line, fill=TEXT, font=f_msg)
                ty += 28
            draw.text((x0 + 18, y + bh - 22), when, fill=MUTED, font=f_ts)
        y += bh + 16
        if y > h - 220:
            break

    # Composer
    draw.text((48, h - 170), "Enter to send", fill=MUTED, font=font(16))
    round_rect(draw, (48, h - 140, w - 120, h - 70), 20, WHITE, outline=(212, 212, 216), width=2)
    draw.text((68, h - 118), "Type your message...", fill=(163, 163, 163), font=font(22))
    draw.ellipse((w - 100, h - 136, w - 48, h - 84), fill=(245, 245, 245))
    draw.polygon([(w - 84, h - 118), (w - 64, h - 110), (w - 84, h - 102)], fill=(163, 163, 163))

    return draw_ios_status_bar(out, "9:41").convert("RGB")


def main() -> None:
    assert (TMP / "03-chat-empty.png").exists(), "missing real empty chat capture"
    for name in ("sunny", "midnight", "cherry", "whiskers"):
        assert (AV / f"{name}.jpg").exists(), f"missing avatar {name}"

    desk = fill_desktop_chat()
    desk.save(TMP / "04-chat-active.png", "PNG")
    print(f"wrote 04-chat-active.png {desk.size}")

    mob = fill_mobile_chat()
    mob.save(TMP / "07-chat-mobile.png", "PNG")
    print(f"wrote 07-chat-mobile.png {mob.size}")

    # Also stamp status bar onto other mobile plates used in mockups
    for name in ("05-home-mobile.png", "06-cat-modal-mobile.png"):
        path = TMP / name
        if path.exists():
            stamped = draw_ios_status_bar(Image.open(path), "9:41")
            stamped.convert("RGB").save(path)
            print(f"stamped status bar → {name}")


if __name__ == "__main__":
    main()
