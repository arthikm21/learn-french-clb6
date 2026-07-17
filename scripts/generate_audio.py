#!/usr/bin/env python3
"""Generate MP3s for every French string via Edge TTS neural voices.

Inputs:
  scripts/strings.json         — array of strings (default voice: Sylvie)
  scripts/strings_voiced.json  — array of "VOICE|text" entries (for non-default voices)

Outputs:
  audio/<sha1>.mp3                — one file per (voice, text) combo
  audio/manifest.json             — maps "text" → "audio/X.mp3" (default voice)
                                    and "VOICE|text" → "audio/X.mp3" (non-default voices)

The TTS module looks up non-default voices first via "VOICE|text", then falls
back to "text" — so adding voice variants is purely additive.
"""
import asyncio, edge_tts, hashlib, json, os, re, sys, time

DEFAULT_VOICE = "fr-CA-SylvieNeural"   # Canadian female neural — matches CLB target
RATE  = "-5%"                          # slightly slower for learners
CONCURRENCY = 6

def spoken_form(text: str) -> str:
    """What the voice is actually asked to say.

    Bare fragments ("les chats", "avec") make the neural voice code-switch to
    English — it literally said "less chats". Framing the fragment as a
    sentence (leading capital + final period) locks French prosody. Strings
    that already end in sentence punctuation (incl. inside closing quotes)
    pass through untouched, so their cached clips stay valid.
    """
    t = text.strip()
    if not t:
        return t
    core = re.sub(r'[»«"\'\s)\]]+$', '', t)
    if core and core[-1] in '.!?…':
        return t
    t = re.sub(r'[,;:\s]+$', '', t)
    return t[0].upper() + t[1:] + '.'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "audio")
STRINGS_JSON = os.path.join(ROOT, "scripts", "strings.json")
VOICED_JSON  = os.path.join(ROOT, "scripts", "strings_voiced.json")

def hash_name(text: str, voice: str) -> str:
    h = hashlib.sha1(f"{voice}|{text}".encode("utf-8")).hexdigest()[:16]
    return f"{h}.mp3"

async def gen_one(sem, text, voice, manifest_key, manifest, stats):
    # Hash the SPOKEN form: sentence-framing a fragment changes what the voice
    # says, so it must also change the filename or the stale clip stays cached.
    speak = spoken_form(text)
    fn = hash_name(speak, voice)
    path = os.path.join(OUT, fn)
    manifest[manifest_key] = f"audio/{fn}"
    if os.path.exists(path) and os.path.getsize(path) > 200:
        stats["cached"] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                c = edge_tts.Communicate(speak, voice, rate=RATE)
                await c.save(path)
                stats["generated"] += 1
                done = stats["generated"] + stats["cached"]
                if done % 20 == 0:
                    print(f"  {done}/{stats['total']} ...", flush=True)
                return
            except Exception as e:
                if attempt == 2:
                    print(f"  FAIL: {text[:50]!r} → {e}", flush=True)
                    stats["failed"] += 1
                    return
                await asyncio.sleep(0.5 * (attempt + 1))

async def main():
    os.makedirs(OUT, exist_ok=True)

    # Default-voice strings: keyed by plain text
    with open(STRINGS_JSON, encoding="utf-8") as f:
        default_strings = json.load(f)

    # Voice-tagged strings: keyed by "VOICE|text" in both input AND manifest
    voiced = []
    if os.path.exists(VOICED_JSON):
        with open(VOICED_JSON, encoding="utf-8") as f:
            voiced = json.load(f)

    stats = {
        "total": len(default_strings) + len(voiced),
        "generated": 0,
        "cached": 0,
        "failed": 0,
    }
    print(f"Generating {stats['total']} clips "
          f"({len(default_strings)} default {DEFAULT_VOICE}, "
          f"{len(voiced)} voice-tagged) at rate {RATE}", flush=True)

    manifest = {}
    sem = asyncio.Semaphore(CONCURRENCY)
    t0 = time.time()

    tasks = []
    # Default voice
    for s in default_strings:
        tasks.append(gen_one(sem, s, DEFAULT_VOICE, s, manifest, stats))
    # Voice-tagged: split "VOICE|text" → voice, text. Key the manifest with the
    # full prefixed form so the lookup in TTS.js matches.
    for entry in voiced:
        if "|" not in entry:
            continue
        voice, text = entry.split("|", 1)
        tasks.append(gen_one(sem, text, voice, entry, manifest, stats))

    await asyncio.gather(*tasks)

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"\nDone in {time.time()-t0:.1f}s — generated={stats['generated']} "
          f"cached={stats['cached']} failed={stats['failed']}")
    print(f"Manifest: audio/manifest.json ({len(manifest)} entries)")

if __name__ == "__main__":
    asyncio.run(main())
