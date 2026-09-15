# AI Proposal Generator

An AI-powered proposal generator built as part of my software development bootcamp challenge.

The goal of this project was to create a complete workflow that takes client information and uses AI to turn it into a professional project proposal.

## What It Does

The application allows a user to:

- Enter client notes or a transcript
- Use voice input to convert speech into text
- Generate a proposal using AI
- Edit the generated proposal
- Upload a company logo
- Preview the logo on the proposal
- Print or save the finished proposal as a PDF

## How It Works

The application follows this workflow:

Client notes / voice input  
↓  
JavaScript frontend  
↓  
Node.js / Express backend  
↓  
Claude API  
↓  
AI-generated proposal  
↓  
User reviews and edits proposal  
↓  
Logo customization  
↓  
Print / Save as PDF

The frontend communicates with the backend using `fetch()`. The backend handles the AI API request so the API key is not exposed in the frontend.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Claude API
- Git
- GitHub

## Key Features

### AI Proposal Generation

Client information is sent to the backend, which sends it to Claude to generate a structured professional proposal.

### Voice Input

The application uses the browser's Speech Recognition API to convert spoken input into text.

### Editable Proposal

The generated proposal appears in an editable text area so the user can review and customize the AI-generated content.

### Company Logo

Users can upload an image file and preview the logo at the top of the proposal.

### PDF

The Download button uses the browser's print functionality, allowing the user to print the proposal or save it as a PDF.

The print layout removes the application interface and keeps the proposal and logo.

## Security

The Claude API key is stored on the backend using environment variables.

The API key is not included in the frontend JavaScript or committed to GitHub.

## What I Learned

This project helped me move beyond basic HTML and CSS and start working with a complete application.

I learned how to:

- Connect a frontend to a backend
- Build a Node.js and Express server
- Use `fetch()` to send data between the frontend and backend
- Work with an AI API
- Structure prompts for AI-generated content
- Validate user input
- Handle errors
- Use environment variables to protect API keys
- Work with browser speech recognition
- Upload and preview images
- Use browser print functionality
- Test an application from beginning to end
- Use Git and GitHub to track and publish my work

## Challenges

One of the biggest challenges was understanding how the different parts of the application connect together.

I started with the frontend and gradually learned how the frontend could communicate with a Node.js backend and how the backend could communicate with an AI API.

I also learned that testing each feature individually is not enough. The complete workflow needs to be tested from the user's input all the way to the final proposal.

## Current Version

This is an MVP (Minimum Viable Product) created for a bootcamp challenge.

The main goal was to demonstrate a working end-to-end proposal generation workflow rather than build a complete commercial application.

## Future Improvements

Possible future improvements include:

- Automatic call recording and transcription
- Proposal templates
- More advanced PDF generation
- Client information management
- Additional proposal customization
- Multiple proposal formats
- Improved voice input and transcription

## Walkthrough

[Watch the walkthrough](https://www.loom.com/share/0807e1a0b92347d6a1fb1359decced0a)

## Live Demo

Frontend hosted on GitHub Pages.

AI generation currently requires the Node.js backend to be running locally.
See walkthrough video for full functionality.
