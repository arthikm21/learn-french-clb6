# Contributing to Bonjour!

Thank you for helping make Canadian French preparation more accessible.

## Ways to contribute

- Report a bug or accessibility problem.
- Correct a French explanation, translation, or exercise.
- Improve keyboard, screen-reader, mobile, or low-bandwidth support.
- Add tests or strengthen existing validation.
- Propose a focused learning activity aligned with NCLC/CLB or TCF/TEF Canada.

Please open an issue before starting a large feature so the approach can be
discussed first. Small fixes may be submitted directly as pull requests.

## Local setup

Bonjour! uses plain HTML, CSS, and JavaScript with no application build step.
Node.js 20 or newer is required for the preview server and checks.

```bash
npm start
```

Open <http://localhost:8765>. To use another port:

```bash
PORT=8000 npm start
```

## Run the checks

```bash
npm test
npm run check
```

Run the complete check before submitting a pull request.

## Pull-request guidelines

- Keep each pull request focused on one problem.
- Explain the learner benefit and how the change was tested.
- Preserve the privacy-first design: no learner accounts, behavioural tracking,
  or remote storage of recordings.
- Do not add copyrighted exam questions, unlicensed audio, credentials, or
  private learner information.
- Keep claims about exam readiness and outcomes careful and evidence-based.

## Educational accuracy

French-learning content should include a source or rationale when a correction
is not self-evident. Material inspired by TCF or TEF formats must be original;
do not reproduce protected exam content.

By contributing, you agree that your contribution will be licensed under the
MIT License that covers this repository.
