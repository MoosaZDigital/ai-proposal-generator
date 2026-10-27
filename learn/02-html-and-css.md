# Day 2: The Page (HTML and CSS)

Files: `public/index.html`, `public/Styles.css`

## HTML is the structure

Open `public/index.html`. The page has two main boxes inside `.app-container`:

- **`.input-section`**: the notes `<textarea>`, the **Record** button and the **Generate Proposal** button.
- **`.output-section`**: the logo `<input type="file">`, the **Download** button, and `#proposalDocument` (the logo preview `<img>`, a heading and the proposal `<textarea>`).

Things worth being able to explain:

- **`class` vs `id`.** A class (`class="input-section"`) can be shared by many elements and is mostly for styling. An id (`id="generateButton"`) must be unique on the page, so it's the reliable way for JavaScript to find one specific element. You learned this the hard way on Day 6 of the build (see `NOTES.md`): `querySelector(".input-section button")` grabbed the *first* button, which became Record instead of Generate once you added it.
- **`<textarea>`** allows multi-line text; a normal `<input>` is one line.
- **`accept="image/*"`** on the file input filters the file picker to images.
- **`<script src="script.js">` is at the bottom of `<body>`.** The browser reads HTML top to bottom. If the script ran at the top, the buttons wouldn't exist yet and `querySelector` would find nothing.
- **`<meta name="viewport" ...>`** makes the page scale properly on phones.

## CSS is the look

Open `public/Styles.css`. A CSS rule is a **selector** (which elements) plus **declarations** (what to change):

```css
.input-section {                          /* selector: elements with class "input-section" */
  background-color: hsl(220, 20%, 60%);   /* declaration: property: value; */
  padding: 24px;
}
```

- **`hsl(hue, saturation, lightness)`** is a way to write colours. Hue 220 is blue; changing only the lightness gives you lighter or darker versions of the same colour, which is why the button's `:hover` colour is the same hue at 45% instead of 70%.
- **`:hover`** applies only while the mouse is over the element.
- **`max-width: 600px; margin: 40px auto;`** keeps the app a readable width and centres it (`auto` splits the leftover space equally on both sides).
- **`box-sizing: border-box`** makes `width: 100%` include padding and border, so the textarea doesn't overflow its box.

## Try it

Change the hue in `body`'s `background-color` from `220` to `150` and reload. Then change it back.

## Check yourself

1. When should you use an `id` instead of a class?
2. Why is the `<script>` tag at the bottom of the page?
3. What does `margin: 40px auto` do?

## Explain it out loud

> "Tell me about a bug you found and how you fixed it." (Use the Record/Generate button bug.)
