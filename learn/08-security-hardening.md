# Day 8: Getting Ready to Go Live

File: `server.js`

On your own computer, the only person who can reach the server is you. Once it's on the internet, **anyone** can send it requests, including automated scripts. Every proposal costs real money, so the server needs protection before it goes live.

These changes were made by Claude before we agreed you'd write the code yourself. Read this lesson closely, and use the "Try it" tasks to test each protection yourself. You need to be able to defend every one of these decisions.

The approach is called **defence in depth**: several separate protections, so if one fails, another still helps.

## 1. Removed open CORS

**Before:** `app.use(cors());`

Browsers normally block a page on one website from reading responses from a *different* website. This rule is the **same-origin policy**, and **CORS** is the way a server can relax it. `cors()` with no options relaxed it for *everyone*, so any website could have used your server, and your API credit, from its own page.

**Fix:** the server now delivers the frontend itself (see #6), so the page and the API share the same origin and CORS isn't needed. The `cors` package was removed completely.

**Honest limit to mention in interviews:** CORS only restricts *browsers*. A script using `curl` ignores it. That's why the rate limit (#2) is still needed.

## 2. Rate limiting

```js
const generateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 hour, in milliseconds
    limit: 10,
    message: { message: "You've reached the limit of 10 proposals per hour..." }
});
app.post("/generate", generateLimiter, async (req, res) => { ... });
```

The limiter counts requests from each visitor's IP address. After 10 in an hour, it answers with status **429 Too Many Requests** and never reaches the Claude call. It's applied only to `/generate`, because that's the route that costs money; loading the page isn't limited.

The error is shaped as `{ message: ... }` on purpose: `script.js` already displays `data.message`, so users see the friendly text with no frontend changes.

**Why 10?** It's generous for someone trying the demo, and it caps the worst case from one visitor. It's a judgement call, so be ready to say how you'd change it (e.g. raise it for logged-in users).

## 3. `trust proxy`

```js
app.set("trust proxy", 1);
```

Hosting platforms put a **proxy** (a middleman server) in front of your app. Without this setting, every request would appear to come from the proxy's IP address, so all visitors would share *one* rate limit: 10 proposals per hour for the whole world. `trust proxy` tells Express to read the visitor's real IP from the header the proxy adds. `1` means "trust exactly one proxy in front of me".

## 4. Input limits

```js
app.use(express.json({ limit: "10kb" }));
const MAX_NOTES_LENGTH = 5000;
...
if (typeof userNotes !== "string" || userNotes.trim() === "") { ... }
if (userNotes.length > MAX_NOTES_LENGTH) { ... }
```

- **10kb body limit:** Express rejects huge requests before even reading them.
- **5,000-character notes limit:** longer notes cost more input tokens. 5,000 characters is roughly two pages, far more than real notes need.
- **`typeof userNotes !== "string"`:** previously, sending `{"notes": 123}` made `userNotes.trim()` crash, because numbers don't have `.trim()`. Now anything that isn't text gets the same friendly 400 error.

## 5. Security headers with helmet

`app.use(helmet());` adds response headers that tell browsers to enable extra protections. Three to know by name:

- **Content-Security-Policy:** only allows scripts and styles from your own site, which blocks a whole class of attacks where someone injects their own script into your page.
- **X-Frame-Options:** stops other sites embedding your page in a hidden frame to trick users into clicking things (**clickjacking**).
- **Strict-Transport-Security:** tells browsers to always use HTTPS for your site.

## 6. Only the `public/` folder is served

The frontend files moved into `public/`, and `express.static("public")` serves only that folder.

**Why this matters a lot:** the tempting shortcut is `express.static(".")` (the whole project folder). That would let anyone open `yoursite.com/.env` and read your API key, or `/server.js` to read your code. With `public/`, those addresses return 404. This was tested.

## 7. Ready for hosting

- **`process.env.PORT || 3000`:** use the host's port if it gives one, otherwise 3000.
- **`fetch("/generate")`** instead of `http://localhost:3000/generate`: "localhost" always means *the visitor's own computer*, so the old address would only ever have worked on yours.
- **`"start": "node server.js"`** in `package.json`: hosting platforms run `npm start` by default.
- **Fail-fast key check** (covered in Day 7).

## How it was tested

The server was started with a fake key (so nothing was charged) and tested with `curl`, a command-line tool for sending requests:

| Test | Expected | Result |
|---|---|---|
| Load `/` and `/script.js` | 200 | ✅ |
| Load `/server.js`, `/.env`, `/package.json` | 404 | ✅ |
| Security headers present | yes | ✅ |
| Empty notes, number instead of text | 400 + friendly message | ✅ |
| 6,000-character notes | 400 "too long" | ✅ |
| 11th request in an hour | 429 | ✅ |
| Start with no key | clear error, exit | ✅ |

## Try it

1. Open http://localhost:3000/server.js. What happens?
2. In DevTools → Network, click the page request and find the `Content-Security-Policy` header.
3. Temporarily change `limit: 10` to `limit: 2`, restart, and generate three times. Then change it back.

## Check yourself

1. Why isn't removing CORS enough on its own?
2. What would go wrong on a host if `trust proxy` were missing?
3. Why serve `public/` instead of the whole project folder?
4. What is "defence in depth"?

## Explain it out loud

> "What did you do to make your app safe to put on the internet?"
