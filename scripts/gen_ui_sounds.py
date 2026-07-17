#!/usr/bin/env python3
"""Render premium UI click samples to audio/ui/*.wav.

Runtime oscillator "ticks" never feel premium, so the primary tap feedback uses
short, carefully-designed samples instead. Each is a warm rounded "pop": a
pitched body with a fast pitch-drop, a soft low-end thock for weight, a gentle
low-passed contact transient (NOT a hi-hat tick), a whisper of room, and light
soft-clipping for harmonic warmth.

Three packs map onto Settings.getClickStyle():
  soft       — gentle, airy, lower
  default    — the balanced "pop" (ships as the default)
  mechanical — crisper contact, a touch brighter, still warm (no harsh highs)

Each pack renders 4 round-robin click variants (so fast tapping stays organic)
plus one richer "nav" arrival sample. The option/back click variants are derived
at playback time by pitch-shifting these, so the file set stays small.

Output: audio/ui/<pack>-click-<1..4>.wav, audio/ui/<pack>-nav.wav (mono 44.1k).
Regenerate: .venv-tts/bin/python scripts/gen_ui_sounds.py
"""
import math
import os
import struct
import wave

import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "audio", "ui")


def env_exp(n, decay):
    """Exponential decay envelope over n samples (decay in seconds)."""
    t = np.arange(n) / SR
    return np.exp(-t / max(decay, 1e-4))


def sine_sweep(n, f0, f1, sweep):
    """Sine whose frequency drops f0->f1 over `sweep` seconds (then holds f1)."""
    t = np.arange(n) / SR
    k = np.minimum(t / max(sweep, 1e-4), 1.0)
    # Instantaneous frequency, integrated to phase.
    inst = f0 * (1 - k) + f1 * k
    phase = 2 * np.pi * np.cumsum(inst) / SR
    return np.sin(phase)


def lowpassed_noise(n, cutoff):
    """White noise through a simple one-pole lowpass — soft contact transient."""
    x = np.random.uniform(-1, 1, n)
    a = math.exp(-2 * math.pi * cutoff / SR)
    y = np.zeros(n)
    prev = 0.0
    for i in range(n):
        prev = (1 - a) * x[i] + a * prev
        y[i] = prev
    return y


def soft_clip(x, drive=1.6):
    """Gentle tanh saturation for warmth without audible distortion."""
    return np.tanh(x * drive) / np.tanh(drive)


def add_room(x, wet=0.08, delay_ms=11, decay=0.045):
    """One quiet early reflection + short decaying tail — a hint of space."""
    d = int(SR * delay_ms / 1000)
    tail_n = int(SR * decay)
    imp = np.random.uniform(-1, 1, tail_n) * env_exp(tail_n, decay * 0.5)
    reflection = np.convolve(x, imp)[: len(x)]
    if d < len(x):
        shifted = np.zeros_like(x)
        shifted[d:] = x[: len(x) - d]
    else:
        shifted = np.zeros_like(x)
    room = 0.5 * shifted + reflection
    m = np.max(np.abs(room)) or 1.0
    return x + wet * (room / m)


def normalize(x, peak=0.7):
    x = x - np.mean(x)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    # 4 ms fade out so the buffer never ends on a discontinuity (a "click").
    fade = min(int(SR * 0.004), len(x))
    if fade:
        x[-fade:] *= np.linspace(1, 0, fade)
    # 0.4 ms fade in to clean the very first sample.
    fin = min(int(SR * 0.0004), len(x))
    if fin:
        x[:fin] *= np.linspace(0, 1, fin)
    return x


def render_click(body_f0, body_f1, sweep, decay, sub_f, sub_gain,
                 tick_f, tick_gain, noise_gain, dur, drive, seed):
    np.random.seed(seed)
    n = int(SR * dur)
    body = sine_sweep(n, body_f0, body_f1, sweep) * env_exp(n, decay)
    # A quiet second partial adds a touch of "wood" without brightness.
    partial = sine_sweep(n, body_f0 * 2.02, body_f1 * 2.02, sweep) * env_exp(n, decay * 0.6) * 0.18
    sub = sine_sweep(n, sub_f, sub_f * 0.72, 0.014) * env_exp(n, 0.02) * sub_gain
    # Contact "tick": a very short mid sine gives defined, tactile presence in
    # the 2-3 kHz band WITHOUT the harsh high hiss of a raw noise burst. A trace
    # of low-passed noise rides with it for realism.
    tn = max(1, int(SR * 0.006))
    tick = np.zeros(n)
    tenv = env_exp(tn, 0.0016)
    tick[:tn] = (sine_sweep(tn, tick_f, tick_f * 0.8, 0.004) * tenv * tick_gain
                 + lowpassed_noise(tn, 5200) * tenv * noise_gain)
    x = body + partial + sub + tick
    x = soft_clip(x, drive)
    x = add_room(x, wet=0.05)
    return normalize(x, peak=0.72)


def render_nav(body_f0, body_f1, bell_f, decay, dur, seed):
    """Arrival sound for navigation — the pop plus a soft bell overtone."""
    np.random.seed(seed)
    n = int(SR * dur)
    body = sine_sweep(n, body_f0, body_f1, 0.03) * env_exp(n, decay)
    sub = sine_sweep(n, 120, 88, 0.014) * env_exp(n, 0.02) * 0.5
    # Soft triangle-ish bell a beat after the tap.
    bell_delay = int(SR * 0.018)
    bell = np.zeros(n)
    bn = n - bell_delay
    if bn > 0:
        tri = sine_sweep(bn, bell_f, bell_f, 0.03) + 0.12 * sine_sweep(bn, bell_f * 2, bell_f * 2, 0.03)
        bell[bell_delay:] = tri * env_exp(bn, 0.11) * 0.32
    x = body + sub + bell
    x = soft_clip(x, 1.4)
    x = add_room(x, wet=0.08)
    return normalize(x, peak=0.7)


# Per-pack synthesis parameters. Kept deliberately close so switching packs
# feels like a tone control, not a different app.
PACKS = {
    "soft": dict(
        f0=620, f1=300, sweep=0.030, decay=0.055, sub_f=115, sub_gain=0.35,
        tick_f=2200, tick_gain=0.22, noise_gain=0.06, dur=0.085, drive=1.3, bell=1046,
    ),
    "default": dict(
        f0=780, f1=380, sweep=0.026, decay=0.045, sub_f=130, sub_gain=0.45,
        tick_f=2600, tick_gain=0.34, noise_gain=0.10, dur=0.075, drive=1.6, bell=1318,
    ),
    "mechanical": dict(
        f0=920, f1=470, sweep=0.020, decay=0.034, sub_f=140, sub_gain=0.40,
        tick_f=3100, tick_gain=0.52, noise_gain=0.16, dur=0.060, drive=1.9, bell=1568,
    ),
}

# Round-robin variation: small pitch/decay/gain jitter per variant.
VARIANTS = [
    dict(fp=1.000, dp=1.00, gp=1.00),
    dict(fp=1.013, dp=0.93, gp=0.96),
    dict(fp=0.988, dp=1.07, gp=1.00),
    dict(fp=1.006, dp=0.97, gp=0.94),
]


def write_wav(path, x):
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def main():
    os.makedirs(OUT, exist_ok=True)
    count = 0
    for pack, p in PACKS.items():
        for i, v in enumerate(VARIANTS, start=1):
            x = render_click(
                body_f0=p["f0"] * v["fp"], body_f1=p["f1"] * v["fp"],
                sweep=p["sweep"], decay=p["decay"] * v["dp"],
                sub_f=p["sub_f"], sub_gain=p["sub_gain"] * v["gp"],
                tick_f=p["tick_f"] * v["fp"], tick_gain=p["tick_gain"] * v["gp"],
                noise_gain=p["noise_gain"],
                dur=p["dur"], drive=p["drive"], seed=1000 + (abs(hash(pack)) % 500) + i,
            )
            write_wav(os.path.join(OUT, f"{pack}-click-{i}.wav"), x)
            count += 1
        nav = render_nav(p["f0"], p["f1"], p["bell"], p["decay"], 0.22, seed=7000 + count)
        write_wav(os.path.join(OUT, f"{pack}-nav.wav"), nav)
        count += 1
    print(f"Rendered {count} UI samples to audio/ui/")


if __name__ == "__main__":
    main()
