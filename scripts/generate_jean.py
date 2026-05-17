#!/usr/bin/env python3
"""Generate Jean-voice MP3s for dialogue lines tagged 'jean'.
Merges into existing audio/manifest.json under voice-prefixed keys."""
import asyncio, edge_tts, hashlib, json, os, sys, time

VOICE = "fr-CA-JeanNeural"
RATE  = "-5%"
CONCURRENCY = 6

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "audio")
JEAN_STRINGS = os.path.join(ROOT, "scripts", "jean_strings.json")
MANIFEST = os.path.join(OUT, "manifest.json")

def hash_name(text, voice):
    h = hashlib.sha1(f"{voice}|{text}".encode("utf-8")).hexdigest()[:16]
    return f"{h}.mp3"

async def gen_one(sem, text, manifest, stats):
    fn = hash_name(text, VOICE)
    path = os.path.join(OUT, fn)
    key = f"{VOICE}|{text}"
    manifest[key] = f"audio/{fn}"
    if os.path.exists(path) and os.path.getsize(path) > 200:
        stats["cached"] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                c = edge_tts.Communicate(text, VOICE, rate=RATE)
                await c.save(path)
                stats["generated"] += 1
                done = stats["generated"] + stats["cached"]
                if done % 20 == 0:
                    print(f"  {done}/{stats['total']} ...", flush=True)
                return
            except Exception as e:
                if attempt == 2:
                    print(f"  FAIL: {text[:50]!r} -> {e}", flush=True)
                    stats["failed"] += 1
                    return
                await asyncio.sleep(0.5 * (attempt + 1))

async def main():
    os.makedirs(OUT, exist_ok=True)
    with open(JEAN_STRINGS, encoding="utf-8") as f:
        strings = json.load(f)
    # Load existing manifest
    manifest = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf-8") as f:
            manifest = json.load(f)
    stats = {"total": len(strings), "generated": 0, "cached": 0, "failed": 0}
    print(f"Generating {len(strings)} Jean-voice clips", flush=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    t0 = time.time()
    await asyncio.gather(*[gen_one(sem, s, manifest, stats) for s in strings])
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"Done in {time.time()-t0:.1f}s — generated={stats['generated']} cached={stats['cached']} failed={stats['failed']}")
    print(f"Manifest now has {len(manifest)} total entries.")

if __name__ == "__main__":
    asyncio.run(main())
