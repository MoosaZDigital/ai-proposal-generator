# Learn This Project

A guide to the AI Proposal Generator, split into short lessons. Read one a day (about 10–15 minutes each). By the end you should be able to explain every part of the project to an employer, including **why** it was built that way.

## How to use each lesson

1. **Read it with the code open beside it.** Every lesson names the file it covers. Find each line it mentions.
2. **Do the "Try it" task.** Change something, break something, see what happens. Then undo it (`git checkout -- <file>` puts a file back to its last committed version).
3. **Answer the "Check yourself" questions without looking.** If you can't, re-read that section.
4. **Say the "Explain it out loud" answer** as if to an interviewer. Saying it out loud is the step that makes it stick.

## Lessons

| Day | Lesson | Main files |
|---|---|---|
| 1 | [The big picture](01-big-picture.md) | all |
| 2 | [The page: HTML and CSS](02-html-and-css.md) | `public/index.html`, `public/Styles.css` |
| 3 | [Making the page interactive](03-frontend-javascript.md) | `public/script.js` |
| 4 | [Logo, voice and PDF features](04-browser-features.md) | `public/script.js` |
| 5 | [The backend server](05-backend-server.md) | `server.js` |
| 6 | [Talking to Claude](06-calling-claude.md) | `server.js` |
| 7 | [Keeping the API key secret](07-api-key-security.md) | `.env`, `.gitignore` |
| 8 | [Getting ready to go live](08-security-hardening.md) | `server.js` |
| 9 | [Interview practice](09-interview-practice.md) | — |

New lessons get added as we improve the project. `IMPROVEMENTS.md` (in the project root) is the short list for your mentor; these lessons are the long version for you.

## Glossary

Words you'll meet often. Come back here whenever one is unclear.

- **Frontend**: the part that runs in the visitor's browser (HTML, CSS, `script.js`).
- **Backend / server**: the part that runs on a computer you control (`server.js`). Visitors can't see its code.
- **Request / response**: the browser asks the server for something (request); the server answers (response).
- **Endpoint / route**: a specific address on the server that does one job, e.g. `POST /generate`.
- **API**: a set of rules for how one program asks another for something. The Claude API is how your server asks Claude to write text.
- **API key**: a secret password that identifies you to the API (and gets billed).
- **JSON**: a text format for sending data, e.g. `{ "notes": "Client needs a website" }`.
- **Status code**: a number in every response saying how it went. `200` OK, `400` your request was bad, `404` not found, `429` too many requests, `500` server error.
- **Middleware**: in Express, a function that runs on every request before your route does (e.g. reading JSON, adding security headers).
- **Environment variable**: a setting given to a program from outside its code, e.g. `ANTHROPIC_API_KEY`.
