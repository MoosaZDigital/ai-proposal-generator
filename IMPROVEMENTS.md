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

## 2. Model upgrade, chosen by testing

I compared the original model (Claude Haiku 4.5) with the newer Claude Haiku 5.5 by generating a proposal from the same realistic client notes on each. Some details were left out of the notes on purpose (payment terms, hosting, a feature the client wasn't sure about) to see whether each model would invent them.

| | Haiku 4.5 | Haiku 5.5 (medium effort) | Haiku 5.5 (low effort) |
|---|---|---|---|
| Time | a few seconds | 25–30 s | ~17 s |
| Prices and budget correct | Yes | Yes | Yes |
| Invented details | **Yes**: a 50/50 deposit, 12 months of free hosting then £300/year, reminder costs "under £20 monthly" | None | None (only generic wording such as "a deposit is payable", with no amounts) |
| Uncertain feature (reminders) | Promised as included | Optional add-on, cost to be confirmed | Optional add-on, cost to be confirmed |
| "Maybe later" feature (online shop) | Not mentioned | Listed as out of scope | Listed as out of scope |
| Approx. cost per proposal | ~$0.008 | ~$0.001–0.002 | ~$0.001 |

**Decision: Haiku 5.5 with `effort: "low"`.** The older model ignored the "do not invent details" instruction and committed the business to things the client never discussed, which is the most damaging mistake a proposal tool can make. Haiku 5.5 stayed accurate, cost less, and low effort cut the wait by about 40% without losing accuracy.

Code changes this required in `server.js`:
- `model: "claude-haiku-5-5"` and `output_config: { effort: "low" }`.
- `max_tokens` raised from 1000 to 16000. Newer models think before writing, and thinking counts toward the limit, so 1000 would cut proposals off. You only pay for tokens actually used, so the higher ceiling costs nothing extra.
- The reply is now read with `message.content.find(block => block.type === "text")` instead of `message.content[0].text`, because the first piece of the reply may be a thinking block rather than the proposal.

## 3. Better feedback on the Generate button

`public/script.js` previously assumed every request succeeded.

| Change | Why it matters |
|---|---|
| The button shows "Generating..." and is disabled while waiting | A proposal takes ~17 seconds. Without feedback the app looks broken, and repeat clicks would each cost money. |
| Server errors (empty notes, too long, rate limit) show in a pop-up | Previously the error text replaced the proposal box, wiping out a proposal the user may have been editing. |
| "Couldn't reach the server" message via `try...catch` | Previously a network failure crashed the click handler silently. |
| The button is reset in `finally` | `finally` runs whether the request succeeded, failed or returned early, so the button can never get stuck. |

**Tested:** empty notes, a real proposal (including clicking again while generating) and the server switched off.

## 4. Site-wide daily cap

The per-visitor limit (10 per hour) doesn't stop many visitors together, or one person switching IP addresses, from using up the whole API balance. A second limiter is now shared by **all** visitors: 50 successful proposals per 24 hours.

| Detail | Why |
|---|---|
| `keyGenerator: () => "everyone"` | Rate limiters normally keep one count per IP. Giving every request the same key makes them share a single count. |
| `skipFailedRequests: true` | Only successful proposals (the ones that cost money) count. Otherwise someone could spam empty requests to block real visitors for the day at no cost to themselves. |
| Runs after the per-visitor limiter | A visitor over their personal limit is stopped first and never uses up the shared allowance. |

With Haiku 5.5 at low effort, this caps spending at about $0.05 a day, so a $5 balance lasts more than three months even under deliberate abuse.

**Tested:** temporarily set to 2. The first two proposals worked, the third showed the daily-limit message, and requests with empty notes didn't count.

## 5. Voice input no longer breaks in unsupported browsers

Firefox doesn't support the Speech Recognition API, so `new SpeechRecognition()` threw an error and left a Record button that did nothing. The code now uses **feature detection**: it checks whether the API exists first, and hides the Record button if it doesn't. **Tested** by temporarily setting `SpeechRecognition` to `undefined`: the button was hidden and there was no console error.

## 6. Bug fixes

| Change | Why it matters |
|---|---|
| Added a missing `;` after `font-family` in the `body` rule (`public/Styles.css`) | Without it, the browser read `font-family` and the `margin` on the next line as one invalid declaration and silently dropped both. The page had been running without its body font setting and margin. CSS gives no error for this, so it's easy to miss; DevTools' Styles panel shows invalid declarations struck through. |
