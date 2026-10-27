# Improvements Since Challenge Submission

A log of the changes made to the AI Proposal Generator after the original 7-day build.

## 1. Security hardening (preparing for a live deployment)

| Change | Why it matters |
|---|---|
| Removed open CORS (`cors()` allowed any website to call the API) | Other sites could have used my backend, and my API credit, to generate their own content. The server now hosts the frontend itself, so cross-origin access isn't needed at all. |
| Added rate limiting with `express-rate-limit` (10 proposals per visitor per hour) | Every proposal costs API credit. Without a limit, a single script could run up a large bill. |
| Added a 5,000-character limit on notes and a 10kb request body limit | Stops oversized requests that would cost more tokens or tie up the server. |
| Checked that the notes are actually text (`typeof === "string"`) | Previously, sending a number or object instead of text crashed the validation with a server error. |
| Added security headers with `helmet` | Adds browser protections such as a Content Security Policy, clickjacking protection (`X-Frame-Options`) and HTTPS enforcement (`Strict-Transport-Security`). |
| Moved the frontend into a `public/` folder and served only that folder | Serving the project root would have let anyone download `server.js`, or even `.env`, by typing the file name into the address bar. |
| The server refuses to start if `ANTHROPIC_API_KEY` is missing | Gives a clear error at startup instead of failing on every request. |
| Port read from `process.env.PORT`, and the frontend calls the relative path `/generate` instead of `http://localhost:3000` | Lets the app run on a hosting platform without code changes. |
| Added an `npm start` script | The standard way hosting platforms start a Node app. |

**Verified:** the page loads; `server.js`, `.env` and `package.json` return 404; empty, non-text and over-length notes are rejected with friendly messages; the 11th request in an hour returns HTTP 429; and the server exits with a clear message when the key is missing.

**Also checked:** the git history was scanned to confirm the API key was never committed.

## 2. Bug fixes

| Change | Why it matters |
|---|---|
| Added a missing `;` after `font-family` in the `body` rule (`public/Styles.css`) | Without it, the browser read `font-family` and the `margin` on the next line as one invalid declaration and silently dropped both. The page had been running without its body font setting and margin. CSS gives no error for this, so it's easy to miss; DevTools' Styles panel shows invalid declarations struck through. |
