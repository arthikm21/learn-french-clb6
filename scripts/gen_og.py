#!/usr/bin/env python3
"""Generate Open Graph social-share image (1200x630 PNG). Text + shapes, no emojis."""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "og-image.png")

W, H = 1200, 630
BLEU   = (0, 85, 164)
BLEU2  = (30, 64, 175)
ROUGE  = (239, 65, 53)
WHITE  = (255, 255, 255)
CREAM  = (255, 249, 230)
INK    = (26, 26, 46)
MUTE   = (107, 114, 128)

# Diagonal gradient background bleu → rouge
img = Image.new("RGB", (W, H), BLEU)
draw = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    r = int(BLEU[0] + (ROUGE[0] - BLEU[0]) * (t * 0.7 + 0.15))
    g = int(BLEU[1] + (ROUGE[1] - BLEU[1]) * (t * 0.7 + 0.15))
    b = int(BLEU[2] + (ROUGE[2] - BLEU[2]) * (t * 0.7 + 0.15))
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Subtle diagonal stripes
stripes = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stripes)
for i in range(-300, 1100, 90):
    sdraw.polygon([(i, 0), (i + 32, 0), (i + 32 + H, H), (i + H, H)], fill=(255, 255, 255, 16))
img = Image.alpha_composite(img.convert("RGBA"), stripes).convert("RGB")
draw = ImageDraw.Draw(img)

# Main white card
CARD_X, CARD_Y, CARD_W, CARD_H = 60, 60, 800, 510

def rounded_rect(draw, xy, radius, fill, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

rounded_rect(draw, (CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_H), radius=28, fill=WHITE)

# Fonts
def font(size, bold=False):
    candidates = [
        ("/System/Library/Fonts/HelveticaNeue.ttc", 1 if bold else 0),
        ("/System/Library/Fonts/Helvetica.ttc", 1 if bold else 0),
        ("/Library/Fonts/Arial.ttf", 0),
        ("/System/Library/Fonts/Supplemental/Arial.ttf", 0),
    ]
    for path, idx in candidates:
        try:
            return ImageFont.truetype(path, size, index=idx)
        except Exception:
            continue
    return ImageFont.load_default()

# Logo: French-flag inspired small bar + "Bonjour!"
LX, LY = CARD_X + 50, CARD_Y + 50
# 3-color vertical bar (bleu blanc rouge) — French flag
bar_w, bar_h = 14, 90
draw.rectangle((LX, LY, LX + bar_w, LY + bar_h // 3), fill=BLEU)
draw.rectangle((LX, LY + bar_h // 3, LX + bar_w, LY + 2 * bar_h // 3), fill=WHITE)
draw.rectangle((LX, LY + 2 * bar_h // 3, LX + bar_w, LY + bar_h), fill=ROUGE)
# Light border on white middle
draw.rectangle((LX, LY + bar_h // 3, LX + bar_w, LY + 2 * bar_h // 3), outline=(220,220,220), width=1)
# Brand
draw.text((LX + 36, LY + 4), "Bonjour!", font=font(84, bold=True), fill=BLEU)

# Headline
draw.text((CARD_X + 50, CARD_Y + 180), "Free TCF Canada", font=font(64, bold=True), fill=INK)
draw.text((CARD_X + 50, CARD_Y + 256), "CLB 6 prep", font=font(64, bold=True), fill=ROUGE)

# Feature line
draw.text(
    (CARD_X + 50, CARD_Y + 354),
    "Phonics · Vocab · Grammar · Listen · Speak",
    font=font(24),
    fill=MUTE,
)
draw.text(
    (CARD_X + 50, CARD_Y + 386),
    "Read · Write · Games · Mock test · TCF guide",
    font=font(24),
    fill=MUTE,
)

# Pill: No signup
pill_text = "No signup  ·  No tracking  ·  100% free"
pill_y = CARD_Y + 430
tx, ty, tw, th = draw.textbbox((0, 0), pill_text, font=font(22, bold=True))
pad_x, pad_y = 24, 12
pill_w = (tw - tx) + pad_x * 2
rounded_rect(draw, (CARD_X + 50, pill_y, CARD_X + 50 + pill_w, pill_y + (th - ty) + pad_y * 2), radius=32, fill=CREAM, outline=BLEU, width=3)
draw.text((CARD_X + 50 + pad_x, pill_y + pad_y), pill_text, font=font(22, bold=True), fill=BLEU)

# URL — placed outside card on gradient bg, white bold
draw.text((CARD_X + 16, CARD_Y + CARD_H + 22), "frenchclb6.vercel.app", font=font(32, bold=True), fill=WHITE)

# Right panel — CLB 6 big badge
RX, RY = 920, 100
panel_w, panel_h = 240, 380
rounded_rect(draw, (RX, RY, RX + panel_w, RY + panel_h), radius=28, fill=WHITE)

# Big "CLB" + "6" stacked
draw.text((RX + 50, RY + 60), "CLB", font=font(56, bold=True), fill=BLEU)
draw.text((RX + 75, RY + 130), "6", font=font(180, bold=True), fill=ROUGE)

# Sub label
draw.text((RX + 40, RY + 320), "Express Entry", font=font(20), fill=MUTE)
draw.text((RX + 30, RY + 346), "& federal jobs", font=font(20), fill=MUTE)

# Footer strip on right panel — Canadian flag stripe (red-white-red horizontal)
fy = RY + panel_h + 24
flag_w = panel_w
draw.rectangle((RX, fy, RX + flag_w // 4, fy + 28), fill=ROUGE)
draw.rectangle((RX + flag_w // 4, fy, RX + 3 * flag_w // 4, fy + 28), fill=WHITE)
draw.rectangle((RX + 3 * flag_w // 4, fy, RX + flag_w, fy + 28), fill=ROUGE)
# Small maple-leaf-substitute centered (red square as accent)
draw.rectangle((RX + flag_w // 2 - 8, fy + 8, RX + flag_w // 2 + 8, fy + 24), fill=ROUGE)

img.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT} ({os.path.getsize(OUT)} bytes)")
