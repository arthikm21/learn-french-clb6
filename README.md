# Bonjour! — Interactive French Learning → CLB 6

Self-paced French learning web app. Targets **CLB 6 in all four modules** (Listening, Speaking, Reading, Writing) at ~30-45 min/day over 3-4 months.

## Stack
- Pure HTML / CSS / JavaScript. No build step. No dependencies.
- Uses browser SpeechSynthesis (TTS) and SpeechRecognition (mic) APIs.
- All progress stored in `localStorage`.

## Run locally
Open `index.html` directly in a browser, or:
```
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

> Speaking module needs Chrome / Edge + microphone permission.

## Deploy
Static site — drops onto Vercel / Netlify / GitHub Pages with zero config. `vercel.json` included.

## Pedagogy
- **Child-first**: pattern + audio + visuals before explicit grammar.
- **Professor-rigorous**: each grammar unit has explicit rules + practice quiz with explanations.
- **Spaced repetition (SM-2)** for vocabulary.
- **38-step path** ordered to CLB 6 with locked progression.

## Modules
| Module | CLB skill | What it does |
|---|---|---|
| Vocab Garden | — | SRS flashcards across 10 themed decks |
| Grammar Quests | — | 12 grammar units A1 → B1 + quizzes |
| Listening Lab | Listening | TTS dictation, Levenshtein-tolerant grading |
| Speaking Mirror | Speaking | Mic + pronunciation similarity score |
| Reading Quests | Reading | Graded texts + MC comprehension |
| Writing Workshop | Writing | Prompted writing + rubric pattern checks |
| Games | — | Gender Sort · Conjugation Race · Sentence Builder · Memory Match |
