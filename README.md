# Bonjour! — Interactive French Learning → CLB 6

Self-paced French learning web app with a structured pathway toward **NCLC/CLB 6 across listening, speaking, reading, and writing**. Readiness timing depends on the learner's starting level and authentic practice outside the app.

## Stack
- Pure HTML / CSS / JavaScript. No build step. No dependencies.
- Uses pre-generated Canadian French neural MP3s with browser speech-synthesis fallback, plus local MediaRecorder capture for speaking practice.
- All progress stored in `localStorage`.

## Run locally
Use the included preview server so production-style clean URLs work:
```
npm start
```
Then visit `http://localhost:8765`. Set a different port with `PORT=8000 npm start`.

> Recorded speaking tasks need a modern browser and microphone permission. Shadowing works without a microphone.

## Deploy
Static site — drops onto Vercel / Netlify / GitHub Pages with zero config. `vercel.json` included.

## Pedagogy
- **Child-first**: pattern + audio + visuals before explicit grammar.
- **Professor-rigorous**: each grammar unit has explicit rules + practice quiz with explanations.
- **Spaced repetition (SM-2)** for vocabulary.
- **Structured path** ordered from foundations through CLB 6 practice.

## Modules
| Module | CLB skill | What it does |
|---|---|---|
| Vocab Garden | — | SRS flashcards across 10 themed decks |
| Grammar Quests | — | 12 grammar units A1 → B1 + quizzes |
| Listening Lab | Listening | TTS dictation, Levenshtein-tolerant grading |
| Speaking practice | Speaking | Accountable shadowing, local recording, task rehearsal, and honest self-checks |
| Reading Quests | Reading | Graded texts + MC comprehension |
| Writing Workshop | Writing | Models, prompted writing, slip scans, and structured self-review |
| Games | — | Gender Sort · Conjugation Race · Sentence Builder · Memory Match |
