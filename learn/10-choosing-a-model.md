# Day 10: Choosing a Model, and Waiting Well

Files: `server.js` (the `anthropic.messages.create` call), `public/script.js` (the Generate button)

## Where the model is chosen

The model is chosen **in your code**, on every request:

```js
model: "claude-haiku-5-5",
```

There's no model setting in the Anthropic Console. One API key can serve many apps, each wanting a different model, so the choice belongs to the code making the request. The Console is for keys, billing, spend limits and usage.

Keep the choice on the **server**. A model dropdown on the page would let any visitor pick the most expensive one. (Never trust the browser.)

## How the choice was made: a test, not a guess

Same client notes, three settings, compared side by side. The notes left some things out on purpose (payment terms, hosting, a feature the client wasn't sure about) to see whether each model would make them up.

| | Haiku 4.5 | Haiku 5.5, medium | Haiku 5.5, low |
|---|---|---|---|
| Time | a few seconds | 25–30 s | ~17 s |
| Invented details | **50/50 deposit, a free year of hosting, then £300/year** | none | none |
| Cost per proposal | ~$0.008 | ~$0.001–0.002 | ~$0.001 |

The older model ignored the "do not invent details" instruction. For a proposal tool, that's the worst kind of mistake: a client could hold the business to a free year of hosting it never offered. **Accuracy beat speed**, and the newer model was also cheaper.

The full results table is in `IMPROVEMENTS.md`.

## Thinking and effort

Newer models **think** before they answer: they reason privately, then write the reply. That's why Haiku 5.5 is more careful, and why it's slower.

```js
output_config: { effort: "low" },
```

**Effort** controls how much thinking the model does: `low`, `medium` (Haiku 5.5's default), `high`, and higher. Less effort means faster and cheaper; more means more careful on hard problems. A one-page proposal from clear notes isn't a hard problem, and the test showed `low` stayed accurate while cutting the wait by about 40%.

## Two changes the new model needed

**1. `max_tokens` went from 1000 to 16000.** Thinking counts toward the limit, so at 1000 there wouldn't be room left for the proposal and it would be cut off mid-sentence. `max_tokens` is a *ceiling*, not a charge: you pay only for tokens actually used.

**2. Reading the reply changed.**

```js
// Before
message.content[0].text

// After
const textBlock = message.content.find((block) => block.type === "text");
textBlock.text
```

`message.content` is a **list** of pieces. The old model sent one piece, the text, so `[0]` worked. The new one can send a thinking piece first. `.find()` goes through a list and returns the first item for which the function returns `true`.

`(block) => block.type === "text"` is an **arrow function**, a short way to write `function (block) { return block.type === "text"; }`.

## Waiting well: the Generate button

A 17-second wait with no feedback looks broken. Users click again, which costs money twice, or leave. The click handler in `public/script.js` now covers every outcome:

```js
generateButton.disabled = true;               // block extra clicks
generateButton.textContent = "Generating..."; // show something is happening

try {
    const response = await fetch(...);
    const data = await response.json();
    if (!response.ok) {          // server answered with an error
        alert(data.message);
        return;
    }
    outputTextarea.value = data.message;
} catch (error) {                // server couldn't be reached
    alert("Couldn't reach the server...");
} finally {                      // ALWAYS runs
    generateButton.disabled = false;
    generateButton.textContent = "Generate Proposal";
}
```

- **`response.ok`** is `true` for status codes in the 200s. `!` means "not".
- Errors go in a **pop-up**, not the proposal box, so a proposal the user was editing isn't wiped out.
- **`finally`** runs whether `try` succeeded, `catch` ran, or `return` left early. That's why it's the one safe place to reset the button.

The server already sent a friendly `message` with every error (Day 8), so the frontend only had to display it. That's the payoff of designing both halves to agree on one response shape.

## Try it

Stop the server and click Generate. Which part of the code shows the pop-up: `if (!response.ok)` or `catch`? Why that one? (Restart the server afterwards.)

## Check yourself

1. Where is the model chosen, and why not in the Console or on the page?
2. Why did `content[0].text` have to change?
3. What does `effort` control, and why `low` here?
4. What does `finally` guarantee that putting the reset at the end of `try` wouldn't?

## Explain it out loud

> "How did you choose which AI model to use?"
