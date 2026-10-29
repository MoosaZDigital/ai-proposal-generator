# Day 9: Interview Practice

Answer each question out loud, then check the lesson in brackets. Repeat any you stumble on. You know the project when you can answer all of these **without notes**.

## The 30-second pitch

Practise until it feels natural. Something like:

> "I built an AI proposal generator. A user types or speaks notes about a client, and it produces a structured business proposal they can edit, brand with their logo and save as a PDF. The frontend is plain HTML, CSS and JavaScript; the backend is Node and Express, which calls the Claude API so the API key never reaches the browser. Before deploying, I hardened it with rate limiting, input validation and security headers, because every request costs money."

## Architecture

1. Walk me through what happens when a user clicks Generate. *(Day 1)*
2. Why does the browser talk to your server instead of directly to Claude? *(Day 1)*
3. What's the difference between your frontend and backend? *(Day 1)*

## Frontend

4. What do `async` and `await` do? *(Day 3)*
5. How does the logo preview work? Is the logo uploaded anywhere? *(Day 4)*
6. Why did you use `window.print()` for the PDF? *(Day 4)*

## Backend and AI

7. What is middleware? Give two examples from your project. *(Day 5)*
8. Why validate input on the server? *(Day 5)*
9. How did you get consistent, structured output from the AI? *(Day 6)*
10. How do you stop the AI making things up? *(Day 6)*

10b. How did you choose which model to use? *(Day 10)*
10c. What happens in your UI while the proposal is generating, or if something fails? *(Day 10)*

## Security

11. How do you keep your API key secret? *(Day 7)*
12. What would you do if you accidentally pushed a key to GitHub? *(Day 7)*
13. What stops someone running up your API bill? *(Day 8)*
14. What is CORS, and why did you remove it? *(Day 8)*

## Reflection

Employers love these. Prepare a real answer for each.

15. Tell me about a bug you found. *(The Record/Generate selector bug, or the two-editors file-reverting bug in `NOTES.md`.)*
16. What would you improve next? *(See `IMPROVEMENTS.md` and the "weakness" notes in Days 3, 4 and 6.)*
17. What trade-offs did you make? *(`window.print()` instead of a PDF library; a fast, cheap model; IP-based rate limiting instead of user accounts.)*
18. What did you learn that surprised you?
