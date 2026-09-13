
require("dotenv").config();

const apiKey = process.env.ANTHROPIC_API_KEY;

const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
    apiKey: apiKey
});


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Proposal Generator backend is running.");
});

app.post("/generate", async (req, res) => {
    const userNotes = req.body.notes;

    if (!userNotes || userNotes.trim() === "") {
        return res.status(400).json({ message: "Please enter some client notes before generating a proposal." });
    }

    try {
    const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: `You are a professional proposal writer. Based on the following client notes, write a complete, professional business proposal.

Structure the proposal with these clearly labeled sections, in plain text (no markdown symbols like # or **):

OVERVIEW
SCOPE OF WORK
TIMELINE
PRICING
TERMS
NEXT STEPS

Use clear paragraph breaks between sections. Base all content strictly on the information provided in the notes below — do not invent specific details that weren't mentioned.

CLIENT NOTES:
${userNotes}`
            }
        ]
    });

    res.json({
        message: message.content[0].text
    });

  } catch (error) {
    console.error("Error calling Claude API:", error);
    res.status(500).json({ message: "Something went wrong while generating the proposal. Please try again." });
  }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});