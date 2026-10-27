# Day 6: Talking to Claude

File: `server.js` (the `anthropic.messages.create` call)

## The SDK

```js
const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: apiKey });
```

You *could* call the Claude API with `fetch()`, but the official **SDK** (Software Development Kit) handles the details: the right address, headers, authentication and error types. You create one client with your key and reuse it for every request.

## The request

```js
const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    messages: [{ role: "user", content: `...prompt...${userNotes}` }]
});
```

- **`model`**: which Claude model to use. Haiku is the fastest and cheapest family, which suits a short, structured writing task.
- **`max_tokens`**: the most the reply may contain. A **token** is a chunk of text, roughly ¾ of a word. You pay per token, both for what you send (input) and for what comes back (output). If the reply hits this limit, it's cut off mid-sentence, and 1000 is tight for a full proposal. That's one of the next improvements.
- **`messages`**: the conversation. Here it's one message from the `user`.
- The backticks make a **template literal**: `${userNotes}` inserts the user's notes into the prompt.

## Reading the reply

```js
message.content[0].text
```

Claude's reply has a `content` list (a reply can contain several pieces); the first piece's `text` is the proposal.

## Prompt engineering

The prompt is where most of the output quality comes from. Each part has a job:

| Part of the prompt | Why it's there |
|---|---|
| "You are a professional proposal writer." | **Role-setting**: sets the tone and quality bar. |
| The list of section names (OVERVIEW, SCOPE OF WORK, ...) | Gives **consistent structure** every time. |
| "in plain text (no markdown symbols like # or \*\*)" | The output goes in a `<textarea>`, which can't display formatting, so `**bold**` would show as literal asterisks. |
| "do not invent specific details that weren't mentioned" | Stops the model making up prices or dates. You tested this with "logo redesign, small budget", and it said pricing would be set separately instead of inventing a number. |
| Notes placed last under "CLIENT NOTES:" | Clearly separates *your instructions* from *the user's data*. |

## Try it

Remove the line about plain text from the prompt, restart, and generate. What changes? Put it back.

## Check yourself

1. What is a token, and why does it matter for cost?
2. What happens if a reply is longer than `max_tokens`?
3. Pick two lines of the prompt and explain why each one is there.

## Explain it out loud

> "How did you get consistent output from the AI?"
