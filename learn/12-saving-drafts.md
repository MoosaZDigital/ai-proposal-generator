# Day 12: Saving Drafts with localStorage

File: `public/script.js` (lines 5–25)

## The problem

Refreshing throws the page away and loads a fresh copy, so anything typed into it is lost. The server can't help: it's **stateless** and never keeps the notes or proposals (Day 11). The only place those words exist is the browser, so that's where they have to be saved.

## localStorage

A small storage space the browser keeps **for each website**, on the user's own computer. It holds text under a name, like labelled boxes:

```js
localStorage.setItem("draftNotes", "some text");   // store
localStorage.getItem("draftNotes");                // read back: "some text"
```

- It survives refreshes, closing the tab and restarting the computer.
- It's **per browser**: drafts saved in Chrome don't appear in Edge, or on another computer.
- It's **never sent to the server**, so it's private to the user.
- It only stores **text**, up to a few megabytes. That's why the logo (an image) isn't saved.

## The code

```js
function saveDraft() {
  try {
    localStorage.setItem("draftNotes", inputTextarea.value);
    localStorage.setItem("draftProposal", outputTextarea.value);
  } catch (error) {
    // Storage can be blocked - the app still works without it
  }
}
```

**`function saveDraft() { ... }`** defines a reusable set of steps with a name. Defining it does nothing by itself; it runs when something calls it.

**`try...catch`** is there because some browsers (certain private-browsing modes, or strict privacy settings) block storage, and `localStorage` then throws an error. Catching it keeps the rest of the app working. Making a feature optional so its failure doesn't break everything else is called **graceful degradation**, the same idea as hiding the Record button in Firefox (Day 11).

```js
try {
  inputTextarea.value = localStorage.getItem("draftNotes") || "";
  outputTextarea.value = localStorage.getItem("draftProposal") || "";
} catch (error) {}
```

This runs **once**, when the page loads. On a first visit nothing is saved yet and `getItem` returns `null`. **`|| ""`** means "if that's empty, use an empty string instead", so the box doesn't show the word "null".

```js
inputTextarea.addEventListener("input", saveDraft);
outputTextarea.addEventListener("input", saveDraft);
window.addEventListener("pagehide", saveDraft);
```

- **`"input"`** fires every time the user types, deletes or pastes in that box.
- **`"pagehide"`** fires when the user refreshes, closes the tab or leaves. It's needed because **code setting `.value` doesn't fire `"input"`**: a newly generated proposal or voice transcription would otherwise only be saved if the user then typed something.
- **`saveDraft` without `()`** passes the function itself, meaning "call this later, on each event". Writing `saveDraft()` would call it once, immediately, and pass its result (nothing) instead. This is one of the most common beginner mistakes, so remember it.

## Try it

1. Open DevTools (`F12`) → **Application** tab → **Local Storage** → `http://localhost:3000`. You'll see `draftNotes` and `draftProposal`. Type in a box and watch the value update.
2. Right-click an entry → **Delete**, then refresh. That box is now empty.
3. Open the app in a different browser. Are your drafts there? Why not?

## Check yourself

1. Why save drafts in the browser rather than on the server?
2. Why is `"pagehide"` needed as well as `"input"`?
3. What's the difference between `addEventListener("input", saveDraft)` and `addEventListener("input", saveDraft())`?
4. What happens on a browser that blocks storage?

## Explain it out loud

> "How does your app avoid losing the user's work?"
