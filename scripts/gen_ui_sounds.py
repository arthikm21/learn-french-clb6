#!/usr/bin/env python3
"""Render the compact Haptic UI palette to ``audio/ui/*.wav``.

The chosen direction is intentionally low, short, and non-musical. Each tap is
made from fewer than three cycles of two low resonances, then gently low-passed.
That creates the suggestion of physical feedback without a bright click, tonal
"boop", noise burst, or audible tail.

Saved preference values remain compatible while all three intensities belong to
one family:
  soft       -- soft haptic: lowest and most muted
  default    -- haptic: the selected balanced character and site default
  mechanical -- firm haptic: slightly more definition, never sharp

Output: audio/ui/<pack>-click-<1..4>.wav and audio/ui/<pack>-nav.wav
Regenerate: .venv-tts/bin/python scripts/gen_ui_sounds.py
"""
import math
import os
import wave

import numpy as np


SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "audio", "ui")


def raised_attack(n, seconds):
    envelope = np.ones(n)
    count = min(n, max(1, int(SR * seconds)))
    envelope[:count] = 0.5 - 0.5 * np.cos(np.pi * np.arange(count) / count)
    return envelope


def onepole_lp(x, cutoff):
    coefficient = math.exp(-2 * math.pi * cutoff / SR)
    out = np.empty_like(x)
    previous = 0.0
    for i, value in enumerate(x):
        previous = (1 - coefficient) * value + coefficient * previous
        out[i] = previous
    return out


def finish(x, cutoff, peak):
    x = onepole_lp(x, cutoff)
    x = np.tanh(x * 1.05)
    x -= np.mean(x)
    maximum = np.max(np.abs(x)) or 1.0
    x = x / maximum * peak
    fade = min(len(x), int(SR * 0.006))
    x[-fade:] *= np.linspace(1, 0, fade)
    return x


def render_impact(pack, pitch=1.0, decay=1.0, balance=1.0):
    """Two damped low resonances: compact enough to feel, not ring."""
    n = int(SR * pack["duration"])
    t = np.arange(n) / SR
    envelope = raised_attack(n, pack["attack"])
    low = (
        np.sin(2 * np.pi * pack["low_f"] * pitch * t)
        * np.exp(-t / (pack["low_decay"] * decay))
        * pack["low_gain"]
    )
    upper = (
        np.sin(2 * np.pi * pack["upper_f"] * pitch * t + 0.25)
        * np.exp(-t / (pack["upper_decay"] * decay))
        * pack["upper_gain"]
        * balance
    )
    return finish((low + upper) * envelope, pack["ceiling"], pack["peak"])


def render_nav(pack):
    """The chosen haptic tap plus a barely perceptible release pulse."""
    n = int(SR * 0.090)
    press = render_impact(pack, pitch=0.98, decay=1.04, balance=0.92)
    release = render_impact(pack, pitch=1.01, decay=0.72, balance=0.72)
    out = np.zeros(n)
    out[: len(press)] += press
    offset = int(SR * 0.041)
    end = min(n, offset + len(release))
    out[offset:end] += release[: end - offset] * 0.15
    return finish(out, pack["ceiling"], pack["peak"] * 0.92)


PACKS = {
    "soft": dict(
        low_f=155, upper_f=270, low_gain=0.76, upper_gain=0.24,
        low_decay=0.014, upper_decay=0.009, attack=0.0030,
        duration=0.040, ceiling=1200, peak=0.48,
    ),
    "default": dict(
        low_f=175, upper_f=310, low_gain=0.72, upper_gain=0.28,
        low_decay=0.012, upper_decay=0.008, attack=0.0028,
        duration=0.036, ceiling=1500, peak=0.50,
    ),
    "mechanical": dict(
        low_f=205, upper_f=360, low_gain=0.68, upper_gain=0.32,
        low_decay=0.010, upper_decay=0.0065, attack=0.0022,
        duration=0.032, ceiling=1800, peak=0.50,
    ),
}


VARIANTS = (
    dict(pitch=1.000, decay=1.00, balance=1.00),
    dict(pitch=1.018, decay=0.94, balance=0.92),
    dict(pitch=0.986, decay=1.05, balance=0.97),
    dict(pitch=1.008, decay=0.97, balance=0.88),
)


def write_wav(path, samples):
    data = (np.clip(samples, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(data.tobytes())


def main():
    os.makedirs(OUT, exist_ok=True)
    count = 0
    for name, pack in PACKS.items():
        for index, variant in enumerate(VARIANTS, start=1):
            write_wav(
                os.path.join(OUT, f"{name}-click-{index}.wav"),
                render_impact(pack, **variant),
            )
            count += 1
        write_wav(os.path.join(OUT, f"{name}-nav.wav"), render_nav(pack))
        count += 1
    print(f"Rendered {count} Haptic UI samples to audio/ui/")


if __name__ == "__main__":
    main()
