# Day 3: Making the Page Interactive

File: `public/script.js` (the first block, up to the logo code)

## Finding elements

```js
const inputTextarea = document.querySelector(".input-section textarea");
const generateButton = document.querySelector("#generateButton");
const outputTextarea = document.querySelector(".output-section textarea");
```

`document.querySelector()` takes a CSS selector and returns the **first** matching element. `.input-section textarea` means "a textarea inside something with class input-section". `#generateButton` means "the element with id generateButton".

`const` means the variable can't be reassigned. The element itself can still change (e.g. its `.value`).

## Reacting to a click

```js
generateButton.addEventListener("click", async function () {
    ...
});
```

`addEventListener` says: "when this event happens on this element, run this function". The function isn't run now; it's handed over to be run later, on every click.

## Sending the notes to the server

```js
const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: userNotes })
});
```

- **`fetch()`** sends an HTTP request from the browser.
- **`"/generate"`** is a *relative* address: "the `/generate` route on whichever server this page came from". It used to be `http://localhost:3000/generate`, which only works on your own computer (Day 8 explains the change).
- **`method: "POST"`**: GET is for fetching things; POST is for sending data to be processed.
- **`headers`**: tells the server "the body is JSON", so Express knows how to read it.
- **`JSON.stringify()`** turns the JavaScript object `{ notes: "..." }` into JSON text, because requests can only carry text.

## `async` and `await`

Asking a server (which then asks Claude) takes a few seconds. JavaScript doesn't freeze the page while it waits.

- `fetch()` returns a **Promise**: an object meaning "the answer will arrive later".
- **`await`** pauses *this function only* until the answer arrives. The rest of the page keeps working.
- You can only use `await` inside a function marked **`async`**.

```js
const data = await response.json();   // read the response body and turn the JSON back into an object
outputTextarea.value = data.message;  // put the proposal in the output box
```

## A weakness you'll fix later

This code assumes everything works. If the server is down, `fetch` throws an error and nothing tells the user. There's also no "Generating..." message, so users may click several times. Fixing this is one of the next improvements, and you'll write it.

## Try it

Add `console.log(data);` after `const data = await response.json();`, generate a proposal, and look at the Console tab in DevTools. Then generate with empty notes and compare. Remove the line afterwards.

## Check yourself

1. What does `await` do, and why is it needed here?
2. Why do we use `JSON.stringify()` before sending?
3. What is the difference between GET and POST?

## Explain it out loud

> "How does your frontend communicate with your backend?"
