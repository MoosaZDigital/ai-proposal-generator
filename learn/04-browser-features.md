# Day 4: Logo, Voice and PDF Features

File: `public/script.js` (everything after the Generate block)

All three features use tools **built into the browser**, so they don't need the server at all.

## Logo preview with `FileReader`

```js
logoInput.addEventListener("change", function () {
  const file = logoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      logoPreview.src = event.target.result;
      logoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});
```

- The **`change`** event fires when the user picks a file.
- `logoInput.files` is a list of chosen files; `[0]` takes the first.
- **`FileReader`** reads a file from the user's computer. `readAsDataURL` turns the image into a long text string (`data:image/png;base64,...`) that can be used directly as an `<img>`'s `src`.
- Reading takes a moment, so you give it an **`onload`** function to run when it's finished. This is the same "do it later" idea as `addEventListener` and `await`.
- **Privacy point for interviews:** the logo never leaves the user's computer. It isn't uploaded anywhere.

## Download with `window.print()`

```js
downloadButton.addEventListener("click", function () {
  window.print();
});
```

Instead of writing code to build a PDF, this opens the browser's print dialog, which already has **Save as PDF**. Print-specific CSS hides the app's buttons and inputs so only the proposal and logo are printed. This is a sensible MVP trade-off: one line of code instead of a PDF library.

## Voice input with Speech Recognition

```js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;       // keep listening instead of stopping after one sentence
recognition.interimResults = false;  // only give us final words, not half-guesses
```

- `a || b` means "use `a` if it exists, otherwise `b`". Chrome names it `webkitSpeechRecognition` (an older vendor prefix), so this line covers both names.
- The **`result`** event delivers everything heard so far; the loop joins each piece into one transcript and puts it in the notes box.
- The **`end`** event resets the button text.

## Update: a bug that has since been fixed

Firefox has **neither** name, so `SpeechRecognition` was `undefined` and `new SpeechRecognition()` threw an error. The code now checks first and hides the Record button if voice input isn't supported. This is called **feature detection**; see Day 11.

## Try it

Pick a logo, then look in DevTools → Network. Is there a request sending the image to the server? (There shouldn't be.)

## Check yourself

1. Does the logo get sent to the server? How do you know?
2. Why use `window.print()` instead of a PDF library?
3. What does `window.SpeechRecognition || window.webkitSpeechRecognition` do?

## Explain it out loud

> "What trade-offs did you make to finish the MVP on time?"
