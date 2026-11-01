require("dotenv").config();

const apiKey = process.env.ANTHROPIC_API_KEY;

// Stop straight away with a clear message instead of failing on the first request
if (!apiKey) {
  console.error(
    "ANTHROPIC_API_KEY is missing. Add it to your .env file (or your host's environment variables).",
  );
  process.exit(1);
}

const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: apiKey,
});

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Hosts like Render sit behind a proxy - this lets the rate limiter see each visitor's real IP
app.set("trust proxy", 1);

// Security headers (blocks clickjacking, restricts where scripts can load from, etc.)
app.use(helmet());

// Small body limit - proposal notes never need more than this
app.use(express.json({ limit: "10kb" }));

// Serve only the frontend folder, so server.js and .env can never be downloaded
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const MAX_NOTES_LENGTH = 5000;

// Each proposal costs API credit, so cap how many one visitor can generate
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: {
    message:
      "You've reached the limit of 10 proposals per hour. Please try again later.",
  },
});

// A second limit shared by ALL visitors, so the total daily cost has a ceiling
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

  const userNotes = req.body.notes;

  if (typeof userNotes !== "string" || userNotes.trim() === "") {
    return res
      .status(400)
      .json({
        message: "Please enter some client notes before generating a proposal.",
      });
  }

  if (userNotes.length > MAX_NOTES_LENGTH) {
    return res
      .status(400)
      .json({
        message: `Notes are too long. Please keep them under ${MAX_NOTES_LENGTH} characters.`,
      });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 16000,
      output_config: { effort: "low" },

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
${userNotes}`,
        },
      ],
    });

    // The reply can contain several pieces (e.g. thinking, then text) - find the text piece
    const textBlock = message.content.find((block) => block.type === "text");

    res.json({
      message: textBlock.text,
    });
  } catch (error) {
    console.error("Error calling Claude API:", error);
    res
      .status(500)
      .json({
        message:
          "Something went wrong while generating the proposal. Please try again.",
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
