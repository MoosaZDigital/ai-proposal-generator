# Day 5: The Backend Server

File: `server.js`

## What a server is

A program that sits and waits for requests, then answers them. `node server.js` (or `npm start`, which runs the same thing) starts it, and it keeps running until you press `Ctrl+C`.

Node only reads your code when it starts. **Change `server.js` → restart the server**, or your change won't apply. (You hit this on Day 5 of the build.)

## Loading tools with `require`

```js
require("dotenv").config();
const express = require("express");
```

`require("name")` loads a package from `node_modules`. `npm install` downloaded them there, and `package.json` lists which ones the project needs, so anyone can run `npm install` to get the same set. (`node_modules` is in `.gitignore` because it's large and can always be re-downloaded.)

## Creating the app and its middleware

```js
const app = express();
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));
```

`app.use(...)` adds **middleware**: functions that run on every request, in order, before your routes.

- **`express.json()`** reads a JSON request body and puts it in `req.body`. Without it, `req.body` would be empty.
- **`express.static("public")`** answers requests for files in the `public` folder. A visit to `/` gets `public/index.html`, `/script.js` gets `public/script.js`, and so on. This is how the server delivers the frontend.

## A route

```js
app.post("/generate", generateLimiter, async (req, res) => {
    const userNotes = req.body.notes;
    ...
    res.json({ message: ... });
});
```

- `app.post("/generate", ...)` means "when a **POST** request arrives at `/generate`, run this".
- **`req`** (request) is what came in: `req.body.notes` is the notes the browser sent.
- **`res`** (response) is how you answer: `res.json(...)` sends JSON back; `res.status(400)` sets the status code first.
- `generateLimiter` is route-specific middleware that runs before the main function. Day 8 covers it.

## Validate first, then spend money

```js
if (typeof userNotes !== "string" || userNotes.trim() === "") {
    return res.status(400).json({ message: "Please enter some client notes..." });
}
```

The server checks the input **before** calling Claude, so bad requests cost nothing. `return` matters: it stops the function there, so the code that calls Claude never runs.

**Never trust the browser.** Anyone can send requests to your server without using your page (with a tool like `curl`), so the server must check everything itself.

## `try...catch`

```js
try {
    const message = await anthropic.messages.create({ ... });
    res.json({ message: message.content[0].text });
} catch (error) {
    console.error("Error calling Claude API:", error);
    res.status(500).json({ message: "Something went wrong..." });
}
```

If anything inside `try` fails (Claude is down, the key is wrong), JavaScript jumps to `catch` instead of crashing the server. The **full error** is logged where only you can see it; the **user** gets a friendly message. Never send raw error details to the user, because they can reveal how your system works.

## Listening

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, ...);
```

A **port** is a numbered "door" on a computer. Locally you use 3000; hosting providers tell your app which port to use through the `PORT` environment variable.

## Try it

Stop the server, add `console.log("Notes received:", userNotes);` as the first line inside the `/generate` route, restart, and generate a proposal. Where does the message appear: the browser console or the terminal? Why? Remove the line afterwards.

## Check yourself

1. What does `express.json()` do, and what breaks without it?
2. Why validate input on the server when the page could check it too?
3. Why log the full error but send the user only a generic message?

## Explain it out loud

> "How does your backend handle errors?"
