# Day 11: A Daily Cap, and Feature Detection

Files: `server.js` (the `dailyLimiter`), `public/script.js` (the voice input block)

## Part 1: the site-wide daily cap

### The gap it fills

The first limiter allows **10 proposals per visitor per hour**. It counts per IP address, so it can't see the total. Twenty visitors, or one person switching IP addresses, could still drain the API balance.

```js
const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 50,
  keyGenerator: () => "everyone",
  skipFailedRequests: true,
  message: {
    message: "The demo has reached its daily limit. Please try again tomorrow.",
  },
});

app.post("/generate", generateLimiter, dailyLimiter, async (req, res) => {
```

### The three ideas in it

**1. One shared count.** A rate limiter keeps a count for each **key**. By default the key is the visitor's IP address, so every visitor gets their own count. `keyGenerator: () => "everyone"` gives every request the same key, so all requests share one count. (`() => "everyone"` is an arrow function with no inputs that always returns the same word.)

**2. Only count what costs money.** `skipFailedRequests: true` means a request that ends in an error (status 400 or above) is taken back off the count. Without it, someone could click Generate with empty notes 50 times, costing you nothing but blocking every real visitor for a day. Blocking real users without spending money is a **denial-of-service** trick, and this setting stops it.

**3. Middleware runs left to right.** In `generateLimiter, dailyLimiter, async (req, res) => {...}`, Express runs each one in order, and any of them can stop the request. So a visitor over their own hourly limit is turned away *before* touching the shared daily count.

### The numbers

50 proposals × ~$0.001 = **~$0.05 a day at most**, so $5 lasts more than three months even if someone tries to drain it. Combined with the per-visitor limit, the Console's spend limit and a prepaid balance with auto-reload off, that's four separate protections: **defence in depth** (Day 8).

### The server is stateless

The server keeps nothing between requests. It receives the notes, passes them to Claude, returns the proposal and forgets everything. The notes and proposal only exist in the browser tab, which is why:

| You do this | Notes and proposal |
|---|---|
| Restart the server | Still there (the browser tab wasn't touched) |
| Refresh the page | Gone (the browser loads a fresh page) |

The rate limiters' counts are the one thing the server remembers, in its memory, so **a restart resets them**. Every deploy restarts the server, which is fine for a portfolio project. A larger app would keep the counts in a separate store (such as Redis) so they survive restarts. That's a good "what would you do at scale?" interview answer.

**Privacy point:** because nothing is stored, the app never keeps clients' business details.

## Part 2: feature detection

### The problem

```js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();   // crashes in Firefox
```

Firefox has neither name, so `SpeechRecognition` is `undefined`, and `new undefined()` throws an error. The Record button stayed on screen doing nothing.

### The fix

```js
if (!SpeechRecognition) {
  recordButton.style.display = "none";
} else {
  const recognition = new SpeechRecognition();
  // ...all the original voice code...
}
```

**Feature detection** means checking whether the browser supports something *before* using it, then adapting. That's better than guessing from the browser's name ("if Firefox..."): browsers add features over time, and a check on the feature itself keeps working when they do.

`undefined` counts as false in an `if`, so `!SpeechRecognition` is true when the feature is missing.

### How it was tested without Firefox

Line 66 was temporarily changed to `const SpeechRecognition = undefined;` to **pretend** to be a browser without the feature. The button was hidden and there was no console error. Then the line was put back. Faking a condition you can't easily reproduce is a normal testing technique, and so is setting `limit: 2` to test the daily cap without making 50 proposals.

## Check yourself

1. Why wasn't the per-visitor limit enough on its own?
2. What does `keyGenerator: () => "everyone"` change?
3. What attack does `skipFailedRequests: true` prevent?
4. Why does restarting the server reset the limits but not the user's notes?
5. What is feature detection, and why is it better than checking the browser's name?

## Explain it out loud

> "How do you control the cost of an app that calls a paid API?"
