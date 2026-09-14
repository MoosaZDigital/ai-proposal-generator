# AI Proposal Generator — Build Notes

## LinkedIn Drafts

### Draft 1 — Day 4

Day 4 of building an AI-powered proposal generator for a coding challenge, and today brought a genuinely humbling debugging lesson.

I connected my frontend to a Node.js/Express backend, which securely calls the Claude API — the whole pipeline (user notes → AI → generated proposal) worked on the first real test. Genuinely exciting moment seeing Claude turn a few rough client notes into a full, structured proposal.

Then my "notes" file (where I log what I'm learning each day) started mysteriously reverting to old content every time I saved it. Spent way longer than I'd like to admit chasing this down — turned out I had the same file open in two different code editors at once, silently overwriting each other every time either one saved.

Lesson learned: stick to one editor per project, and don't leave files open in the background "just in case."

Small bug, but a good reminder that debugging isn't just about code logic — sometimes it's your own workflow that needs the fix.

#buildinpublic #100DaysOfCode #WebDevelopment #AI #LearnToCode

---

# Day 1 — September 8, 2026

## Setup & HTML/CSS

### What I learned

- Learned how to structure a basic HTML webpage.
- Learned how `<div>` elements are used to organize sections of a page.
- Learned how `<textarea>` allows users to enter multiline text.
- Learned how `<button>` creates an interactive button.
- Learned about `<input type="file">` for selecting files.
- Learned about `accept="image/*"` for limiting file selection to images.
- Learned that spaces in an HTML `class` attribute create separate classes.
- Learned why meaningful class names such as `app-container` are useful for organizing CSS.

### What I built

- Created the initial AI Proposal Generator webpage.
- Created an input section containing a notes/transcript textarea and Generate Proposal button.
- Created an output section containing a logo/file upload, proposal textarea, and Download button.
- Created the main app container around both sections.
- Added basic CSS styling: soft off-white background, white cards, professional blue accent, Arial font.
- Tested the HTML and CSS in the browser.

---

# Day 2 — September 9, 2026

## JavaScript & Frontend Interaction

### What I learned

- Learned how `document.querySelector()` finds HTML elements.
- Learned how `.value` reads and changes the contents of form elements such as `<textarea>`.
- Learned how `addEventListener()` responds to user actions.
- Learned how a `click` event can trigger JavaScript.
- Learned how `console.log()` helps with debugging.
- Learned how to use browser Developer Tools to test JavaScript.

### What I built

- Connected JavaScript to the HTML page.
- Selected the input textarea, Generate button, and output textarea with `querySelector()`.
- Added a click event to the Generate Proposal button.
- Built the first working data flow: User notes → Generate button → Output textarea.
- Tested the functionality in the browser.

---

# Day 3 — September 10, 2026

## Backend Setup

### What I learned

- Learned that Node.js allows JavaScript to run outside the browser.
- Learned the difference between frontend and backend JavaScript.
- Learned what Express does and how it receives HTTP requests.
- Learned what an API is, and why API keys should not be placed in frontend JavaScript.
- Learned how `.env` files store sensitive configuration securely.
- Learned how `.gitignore` prevents `.env` from being uploaded to GitHub.
- Learned that an SDK provides tools that make communicating with an API easier.

### What I built

- Installed Node.js, npm, Express, dotenv, and the Anthropic SDK.
- Created `server.js` with a local Express backend on port 3000.
- Created the `/generate` POST endpoint and tested it in the browser.
- Loaded the Claude API key securely from `.env`.
- Added `.env` to `.gitignore`.

### Architecture

Browser → Express backend → Claude API

### Security

- API key stored only in `.env`.
- API key not stored in `index.html` or `script.js`.
- `.env` is protected by `.gitignore` and is not uploaded to GitHub.

---

# Day 4 — September 11, 2026

## Frontend → Backend → Claude Connection

### What I learned

- Learned how `fetch()` sends POST requests with JSON data from the browser.
- Learned what CORS is and why browsers can block requests between different origins.
- Learned how Express receives data and how the Anthropic SDK sends requests to Claude.
- Learned that the API key stays safely on the backend and is never exposed to the browser.

### What I built

- Installed and configured the `cors` package on the Express server.
- Connected the Generate Proposal button to the backend using `fetch()`.
- Connected the backend to Claude Haiku with a prompt to generate a professional proposal.
- Successfully generated the first real AI proposal end to end.

### Working data flow

User enters notes → clicks Generate → JavaScript `fetch()` sends the notes to the Express `/generate` endpoint → Express calls the Claude API → Claude generates the proposal → the backend sends the proposal back to the browser → the user can view and edit it.

### First successful AI test

**Input:**

Client needs a website for a small landscaping business. Budget is $1500. Wants online booking and contact form.

**Result:**

Claude generated a full professional proposal with overview, scope, timeline, pricing, terms, and next steps.

---

# Day 5 — September 12, 2026

## Improving Claude Integration

### What I learned

- Learned how prompt engineering affects output consistency — giving Claude explicit section labels and formatting instructions produces much more structured results.
- Learned how role-setting in prompts ("You are a professional proposal writer") can improve tone and quality.
- Learned how to validate user input on the backend before calling an expensive API, to avoid wasted calls on empty input.
- Learned how `try...catch` blocks handle errors gracefully instead of letting the server crash.
- Learned that editing a running server's code requires stopping it with `Ctrl+C` and restarting it with `node server.js` for changes to take effect.
- Learned that a missing closing bracket can cause a full syntax error that stops the server from starting at all.
- Learned how to trace a syntax error back to an incomplete edit.

### What I built

- Rewrote the Claude prompt with explicit section labels:
  - OVERVIEW
  - SCOPE OF WORK
  - TIMELINE
  - PRICING
  - TERMS
  - NEXT STEPS
- Added plain-text formatting instructions.
- Added an instruction telling Claude not to invent details beyond what the client notes provide.
- Added backend input validation so empty or whitespace-only notes return a friendly error instead of calling the API.
- Wrapped the Claude API call in a `try...catch` block.
- Added clean error handling if the API call fails.
- Verified the improved prompt with the same test case used on Day 4.
- Confirmed that the output was consistently structured and accurately used the provided budget and requirements.

### Bug fixed

After editing the prompt, the server failed to start with:

`SyntaxError: Unexpected end of input`

I traced the problem to a missing `res.json(...)` line and a missing closing `});` for the `app.post` callback, which had accidentally been lost during the prompt edit.

Fixed by comparing the edited code with the previous working version.

---

# Day 6 — September 13, 2026

## Editing, Logo, Voice Input & Download

### What I learned

- Learned that `document.querySelector()` returns only the first matching element — adding a new button before an existing one in the HTML can silently break a selector that isn't specific enough, without throwing an obvious error.
- Learned to use `id` attributes and `#id` selectors for precise, order-independent targeting of specific elements.
- Learned how `FileReader` and `readAsDataURL()` can read a selected image file and display it as a live preview using an `<img>` tag.
- Learned how the browser's built-in Speech Recognition API `SpeechRecognition`) can convert live microphone input into text.
- Learned that `window.print()` provides a simple, functional way to let users save a finished document as a PDF without building custom PDF-generation logic.
- Learned that HTML's `accept` attribute filters the file picker to specific file types and must be added explicitly — it isn't automatic just from setting `type="file"`.

### What I built

- Added a logo upload with a live image preview using `FileReader`.
- Added live voice input using the Speech Recognition API, allowing users to speak their notes instead of typing.
- Added a working Download feature using `window.print()`, allowing users to print the proposal or save it as a PDF.
- Restricted the logo file picker to image files using `accept="image/*"`.
- Added a quick visual polish pass with improved button spacing and a distinct colour for the Record button.
- Added print styling so the final document displays the proposal and logo without the application interface.
- Disabled browser print headers and footers during testing so the final document does not include the local file path.

### Bug found and fixed

After adding the Record button before the Generate button in the HTML, `generateButton` was accidentally selecting the wrong button because:

`document.querySelector(".input-section button")`

only selects the first matching button.

This silently broke the Generate feature without an obvious error.

Fixed by giving both buttons unique `id` attributes and selecting them by ID instead of by their position in the HTML.

### Testing performed

- Tested with a detailed input for a food truck app, including a $3,000 budget and six-week timeline.
- Confirmed the proposal accurately reflected the provided details.
- Tested with a vague input such as "logo redesign, small budget."
- Confirmed Claude avoided inventing a fake price and instead noted that pricing would be determined separately.
- Tested voice input twice with different sentences.
- Confirmed voice input reliably transcribed the spoken notes.
- Confirmed generated proposals reflected the voice input.
- Tested logo upload and confirmed the logo appears in the proposal.
- Confirmed the logo file picker is restricted to images.
- Tested proposal editing in the output textarea.
- Tested the Download button and print preview.
- Confirmed the proposal can be saved as a PDF.
- Confirmed browser headers and footers can be disabled so the local file path does not appear in the final document.

---

# Day 7 — September 14, 2026

## Final Testing & Submission

### What I learned

- Learned the importance of testing the complete application from beginning to end rather than testing individual features only.
- Learned how testing different types of user input can reveal weaknesses in AI-generated output.
- Learned that an MVP does not need every possible feature to demonstrate a complete working process.
- Learned how browser print functionality can provide a practical way to turn a web-based document into a PDF.
- Learned how to prepare and document a project for final presentation.

### Final testing

- Tested the complete flow from client notes to AI-generated proposal.
- Tested editing the generated proposal before downloading.
- Tested voice input and confirmed that speech is converted into text.
- Tested logo upload and confirmed that the logo appears in the proposal.
- Tested the Download button and print preview.
- Confirmed the proposal can be saved as a PDF.
- Confirmed the final print layout hides the application interface.
- Confirmed browser headers and footers are disabled for a clean final document.
- Confirmed the final version was committed and pushed to GitHub.

### Final result

The application now works end to end:

Client notes or voice input → AI processing → structured proposal → user editing → logo customisation → print / save as PDF.

### Final submission

- Final version pushed to GitHub.
- Final walkthrough video prepared.
- Project prepared for final challenge submission.

---

# Current Project Status

## Working

- HTML structure
- CSS styling
- JavaScript interaction
- Node.js backend
- Express server
- `.env` API key security
- `.gitignore` protection
- CORS
- Frontend-to-backend connection
- Backend-to-Claude connection
- AI proposal generation
- Proposal editing
- Logo upload and preview
- Voice input
- Print / Save as PDF
- End-to-end workflow

## Architecture

Browser → JavaScript → Express backend → Claude API → Express backend → JavaScript → Proposal

## Security

- API key stored only on the backend in `.env`.
- `.env` is excluded from GitHub using `.gitignore`.
- API key is never placed in frontend JavaScript or HTML.

## Debugging Note

Spent significant time troubleshooting a file-sync issue where `NOTES.md` kept reverting to old content.

The issue was caused by having the same file open in both VS Code and Cursor simultaneously, causing changes from one editor to overwrite changes from the other.

Resolved by closing VS Code and recreating the file fresh.

This was a useful reminder that debugging isn't always about code logic — sometimes the development workflow itself is the problem.

---

# Final Goal

Client notes or transcript → AI processing → professional proposal → user edits proposal → adds company logo → prints or saves the final proposal as a PDF.

The project demonstrates a complete AI-powered workflow using HTML, CSS, JavaScript, Node.js, Express, an AI API, Git, and GitHub.