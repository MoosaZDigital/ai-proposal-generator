# AI Proposal Generator — Build Notes

## LinkedIn Drafts

### Draft 1 (Day 4)

Day 4 of building an AI-powered proposal generator for a coding challenge, and today brought a genuinely humbling debugging lesson.

I connected my frontend to a Node.js/Express backend, which securely calls the Claude API — the whole pipeline (user notes → AI → generated proposal) worked on the first real test. Genuinely exciting moment seeing Claude turn a few rough client notes into a full, structured proposal.

Then my "notes" file (where I log what I'm learning each day) started mysteriously reverting to old content every time I saved it. Spent way longer than I'd like to admit chasing this down — turned out I had the same file open in two different code editors at once, silently overwriting each other every time either one saved.

Lesson learned: stick to one editor per project, and don't leave files open in the background "just in case."

Small bug, but a good reminder that debugging isn't just about code logic — sometimes it's your own workflow that needs the fix.

#buildinpublic #100DaysOfCode #WebDevelopment #AI #LearnToCode

---



## Day 5 — September 12, 2026



### Improving Claude Integration



#### What I learned

- Learned how prompt engineering affects output consistency — giving Claude explicit section labels and formatting instructions produces much more structured results.
- Learned about role-setting in prompts ("You are a professional proposal writer") to improve tone and quality.
- Learned how to validate user input on the backend before calling an expensive API, to avoid wasted calls on empty input.
- Learned how `try...catch` blocks handle errors gracefully instead of letting the server crash.
- Learned that editing a running server's code requires stopping `Ctrl+C`) and restarting `node server.js`) for changes to take effect.
- Learned that a missing closing bracket can cause a full syntax error that stops the server from starting at all — traced and fixed one caused by an incomplete edit.



#### What I built

- Rewrote the Claude prompt with explicit section labels (OVERVIEW, SCOPE OF WORK, TIMELINE, PRICING, TERMS, NEXT STEPS) and plain-text formatting instructions.
- Added an instruction telling Claude not to invent details beyond what the client notes provide.
- Added input validation: empty or whitespace-only notes now return a friendly error message instead of calling the API.
- Wrapped the Claude API call in a try/catch block, returning a clean error message if the API call fails.
- Verified the improved prompt with the same test case as Day 4 — output was consistently structured and accurately used the provided budget and requirements.



#### Bug fixed

- After editing the prompt, the server failed to start with `SyntaxError: Unexpected end of input`. Traced it to a missing `res.json(...)` line and a missing closing `});` for the `app.post` callback, accidentally lost during the prompt edit. Fixed by comparing against the previous working version.





---

## Day 6 — September 13, 2026

### Editing, Logo, Voice Input, and Download

#### What I learned

- Learned that `document.querySelector()` returns only the *first* matching element — adding a new button before an existing one in the HTML can silently break a selector that isn't specific enough, without throwing any error.

- Learned to use `id` attributes and `#id` selectors for precise, order-independent targeting of specific elements.

- Learned how `FileReader` and `readAsDataURL()` can read a selected image file and display it as a live preview using an `<img>` tag.

- Learned how the browser's built-in Speech Recognition API `SpeechRecognition`) can convert live microphone input into text in real time.

- Learned that `window.print()` provides a simple, functional way to let users save a finished document as a PDF without building custom file-generation logic.

- Learned that HTML's `accept` attribute on a file input filters the file picker to specific file types, and that it must be added explicitly — it isn't automatic just from setting `type="file"`.

#### What I built

- Added a logo upload with a live image preview using `FileReader`.

- Added a live voice input feature using the Speech Recognition API, letting users speak their notes instead of typing.

- Added a working Download feature using `window.print()`, letting users save the finished proposal as a PDF.

- Restricted the logo file picker to image files only using `accept="image/*"`.

- Did a quick visual polish pass: button spacing and a distinct color for the Record button.

#### Bug found and fixed during testing

- After adding the Record button before the Generate button in the HTML, `generateButton` was accidentally selecting the wrong button `document.querySelector(".input-section button")` grabs only the first match). This silently broke the Generate feature with no visible error. Fixed by giving both buttons unique `id` attributes and selecting them by ID instead of by position.

#### Testing performed

- Tested with a detailed input (food truck app, $3,000 budget, 6-week timeline) — proposal accurately reflected all details.

- Tested with a vague input ("logo redesign, small budget") — Claude correctly avoided inventing a fake price, instead noting pricing would follow separately.

- Tested voice input twice with different sentences — reliably transcribed and generated correct proposals both times.

- Confirmed logo upload restricts file selection to images only.

---

---

---



## Day 1 — September 8, 2026



### Setup & HTML/CSS



#### What I learned

- Learned how to structure a basic HTML webpage.
- Learned how `<div>` elements are used to organize sections of a page.
- Learned how `<textarea>` allows users to enter multiline text.
- Learned how `<button>` creates an interactive button.
- Learned about `<input type="file">` for selecting files.
- Learned about `accept="image/*"` for limiting file selection to images.
- Learned that spaces in an HTML `class` attribute create separate classes.
- Learned why meaningful class names such as `app-container` are useful for organizing CSS.



#### What I built

- Created the initial AI Proposal Generator webpage.
- Created an input section containing a notes/transcript textarea and Generate Proposal button.
- Created an output section containing a logo/file upload, proposal textarea, and Download button.
- Created the main app container around both sections.
- Added basic CSS styling: soft off-white background, white cards, professional blue accent, Arial font.
- Tested the HTML and CSS in the browser.

---



## Day 2 — September 9, 2026



### JavaScript & Frontend Interaction



#### What I learned

- Learned how `document.querySelector()` finds HTML elements.
- Learned how `.value` reads and changes the contents of form elements such as `<textarea>`.
- Learned how `addEventListener()` responds to user actions.
- Learned how a `click` event can trigger JavaScript.
- Learned how `console.log()` helps with debugging.
- Learned how to use browser Developer Tools to test JavaScript.



#### What I built

- Connected JavaScript to the HTML page.
- Selected the input textarea, Generate button, and output textarea with `querySelector()`.
- Added a click event to the Generate Proposal button.
- Built the first working data flow: User notes to Generate button to Output textarea.
- Tested the functionality in the browser.

---



## Day 3 — September 10, 2026



### Backend Setup



#### What I learned

- Learned that Node.js allows JavaScript to run outside the browser.
- Learned the difference between frontend and backend JavaScript.
- Learned what Express does and how it receives HTTP requests.
- Learned what an API is, and why API keys should not be placed in frontend JavaScript.
- Learned how `.env` files store sensitive configuration securely.
- Learned how `.gitignore` prevents `.env` from being uploaded to GitHub.
- Learned that an SDK provides tools that make communicating with an API easier.



#### What I built

- Installed Node.js, npm, Express, dotenv, and the Anthropic SDK.
- Created `server.js` with a local Express backend on port 3000.
- Created the `/generate` POST endpoint and tested it in the browser.
- Loaded the Claude API key securely from `.env`, and added `.env` to `.gitignore`.



#### Architecture

Browser to Express backend to Claude API.

#### Security

- API key stored only in `.env`.
- Not stored in `index.html` or `script.js`.
- Not uploaded to GitHub, protected by `.gitignore`.

---



## Day 4 — September 11, 2026



### Frontend to Backend to Claude Connection



#### What I learned

- Learned how `fetch()` sends POST requests with JSON data from the browser.
- Learned what CORS is and why browsers block requests between different origins.
- Learned how Express receives data and how the Anthropic SDK sends requests to Claude.
- Learned that the API key stays safely on the backend, never exposed to the browser.



#### What I built

- Installed and configured the `cors` package on the Express server.
- Connected the Generate Proposal button to the backend using `fetch()`.
- Connected the backend to Claude Haiku with a prompt to generate a professional proposal.
- Successfully generated the first real AI proposal end-to-end.



#### Working data flow

User enters notes, clicks Generate, JavaScript fetch() sends data to Express /generate endpoint, which calls the Claude API, gets a generated proposal back, and sends it to the browser for the user to see and edit.

#### First successful AI test

**Input:** Client needs a website for a small landscaping business. Budget is $1500. Wants online booking and contact form.

**Result:** Claude generated a full professional proposal with overview, scope, timeline, pricing, terms, and next steps.

---



# Current Project Status



## Working

HTML structure, CSS styling, JavaScript interaction, Node.js backend, Express server, .env API key security, .gitignore protection, CORS, frontend-backend connection, backend-Claude connection, and full AI proposal generation — all functioning end to end.

## Debugging note

Spent significant time troubleshooting a file-sync issue where [NOTES.md](http://NOTES.md) kept reverting to old content, caused by having the same file open in both VS Code and Cursor simultaneously. Resolved by closing VS Code and recreating the file fresh.

---



# Next Steps



## Day 5 — Improve Claude Integration

- Improve the proposal prompt for more consistent sections.
- Make sure Claude uses the specific information provided by the client.
- Improve proposal formatting.
- Handle empty notes and API errors gracefully.



## Day 6 — Proposal Editing & Features

- Make the generated proposal easy to edit.
- Improve the proposal layout.
- Add logo upload functionality.
- Add a working Download feature if time allows.



## Day 7 — Testing & Final Submission

- Test different client inputs and fix bugs.
- Test the complete flow from notes to proposal.
- Record the project walkthrough.
- Prepare and submit the Notion submission.

---



# Final Goal

Client notes or transcript, processed by AI, becomes a professional proposal, which the user edits, adds a logo to, and downloads as a final proposal.