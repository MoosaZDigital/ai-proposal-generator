# Day 1: The Big Picture

## What the app does, in one sentence

A user types (or speaks) rough notes about a client, and the app turns them into a structured business proposal they can edit, brand with a logo, and save as a PDF.

## The two halves

The project has two parts that run in **different places**:

```
  VISITOR'S BROWSER                         YOUR SERVER                    ANTHROPIC
┌──────────────────────┐   POST /generate  ┌──────────────┐   API call   ┌──────────┐
│ index.html (layout)  │ ────────────────▶ │  server.js   │ ───────────▶ │  Claude  │
│ Styles.css (looks)   │   { notes: ... }  │  (Express)   │  + API key   │          │
│ script.js (behaviour)│ ◀──────────────── │              │ ◀─────────── │          │
└──────────────────────┘ { message: ... }  └──────────────┘   proposal   └──────────┘
```

- **The frontend** (`public/` folder) is downloaded by the visitor and runs in *their* browser. Anyone can read this code by right-clicking → View Source.
- **The backend** (`server.js`) runs on *your* machine (or your hosting provider's). Visitors can only talk to it through the routes you create; they can't see its code or its secrets.

## Why not call Claude straight from the browser?

This is the most important design decision in the project, and a very common interview question.

Calling Claude requires the API key. Anything in the browser can be read by the visitor, so a key in `script.js` would be public. Anyone could copy it and run up charges on your account.

So the browser asks **your server**, and only your server holds the key. The server acts as a middleman that you control.

## Follow one proposal from start to finish

1. User types notes and clicks **Generate Proposal**.
2. `script.js` packages the notes as JSON and sends them to `/generate` with `fetch()`.
3. `server.js` receives the request, checks the notes are valid, and checks this visitor hasn't hit the rate limit.
4. `server.js` sends the notes, wrapped in instructions (the *prompt*), to Claude using the API key.
5. Claude replies with the proposal text.
6. `server.js` sends that text back to the browser as JSON.
7. `script.js` puts the text into the output box, where the user can edit it.
8. User adds a logo and clicks **Download**, which opens the browser's print dialog → Save as PDF.

## The tools used

| Tool | What it's for |
|---|---|
| HTML / CSS / JavaScript | The page, its look, and its behaviour |
| Node.js | Lets JavaScript run outside a browser, so you can write a server in it |
| Express | A library that makes writing a Node server much simpler |
| Anthropic SDK | A library that makes calling the Claude API simpler |
| dotenv | Loads secret settings from the `.env` file |
| helmet, express-rate-limit | Security protections (Day 8) |
| Git / GitHub | Version history and sharing the code |

## Try it

Run `npm start`, open http://localhost:3000, and generate a proposal. Then open DevTools (F12) → **Network** tab, generate again, and click the `generate` row. Find the notes you sent (the **Payload** tab) and the proposal you got back (the **Response** tab). That is step 2 and step 6 above, happening in front of you.

## Check yourself

1. Which files run in the browser, and which run on the server?
2. Why does the API key live on the server?
3. What format is used to send the notes from the browser to the server?

## Explain it out loud

> "Walk me through what happens when a user clicks Generate."
