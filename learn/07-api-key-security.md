# Day 7: Keeping the API Key Secret

Files: `.env`, `.gitignore`, the top of `server.js`

## Why the key is so sensitive

The API key is how Anthropic knows a request is yours, and it's what gets **billed**. Anyone with it can use Claude on your account. Treat it like a bank card number.

## `.env` and dotenv

```
ANTHROPIC_API_KEY=sk-ant-...
```

`.env` is a plain text file of settings. `require("dotenv").config()` reads it at startup and puts each line into `process.env`, so the code can use `process.env.ANTHROPIC_API_KEY` without the key ever being written in the code itself.

**Why not just paste the key into `server.js`?** Because code gets shared: committed to GitHub, sent to a mentor, shown in a video. Keeping secrets in a separate file means the code can be public while the secrets stay private.

## `.gitignore`

```
.env
node_modules
```

Git will never track files listed here, so `.env` can't be pushed to GitHub by accident. On 2026-10-27 the whole git history was searched to confirm `.env` was never committed.

**If a key ever does get committed:** deleting it in a later commit isn't enough, because it's still in the history. The only real fix is to **revoke the key** and make a new one. Bots scan GitHub for leaked keys within minutes.

## Fail fast if it's missing

```js
if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is missing...");
    process.exit(1);
}
```

`!apiKey` is true if the key is missing or empty. Rather than starting a server where every request fails mysteriously, it stops immediately with a clear message. `process.exit(1)` ends the program; `1` means "exited because of a problem" (`0` means success).

## In production

On a hosting platform there's no `.env` file. You paste the key into the host's **environment variables** settings page instead. `process.env.ANTHROPIC_API_KEY` works the same either way, which is the whole point: the code doesn't need to know where the setting came from.

## Rotating the key

Making a new key and revoking the old one is called **rotating** it. It's good practice when preparing to go live, after sharing your screen, or whenever you aren't sure where a key has been. The order matters: **create the new key → update `.env` (and the host) → test → revoke the old one**, so the app never runs without a working key. Setting a **monthly spend limit** in the Anthropic Console gives you a hard ceiling if something goes wrong anyway.

## Check yourself

1. What would happen if the API key were in `script.js`?
2. What do `.env` and `.gitignore` each do, and why do you need both?
3. A key was committed and then deleted in the next commit. Is it safe? What should you do?

## Explain it out loud

> "How did you handle secrets in this project?"
