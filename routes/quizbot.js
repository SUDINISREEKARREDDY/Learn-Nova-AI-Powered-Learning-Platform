const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('quizbot');
});

router.post('/generate', async (req, res) => {
  const { topic, numQuestions, duration } = req.body;

  try {
    const prompt = `
    Generate a quiz on "${topic}" with ${numQuestions} multiple-choice questions.
    Each question should have:
    - "question"
    - "options" (array of 4 strings, each starting with A., B., C., D.)
    - "answer" (just one letter: A/B/C/D)
    - "explanation"

    Return ONLY a valid JSON array, no text outside JSON.
    `;

    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "gemma3:1b",
      prompt,
      stream: false,
    });

    let raw = response.data.response;

    // Remove markdown fences if present
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Try parsing strictly first
    let quiz;
    try {
      quiz = JSON.parse(raw);
    } catch (err) {
      console.warn("Strict parse failed, trying cleanup...");

      // Fix common issues: add quotes around unquoted options, remove trailing commas
      raw = raw
        .replace(/([{\[,]\s*)([A-D]\.)/g, '$1"$2') // ensure options are quoted
        .replace(/(\.")(,?\s*[}\]])/g, '$1$2')     // remove accidental commas
        .replace(/“|”/g, '"')                      // replace smart quotes
        .replace(/,\s*}/g, '}')                    // remove trailing commas in objects
        .replace(/,\s*]/g, ']');                   // remove trailing commas in arrays

      quiz = JSON.parse(raw);
    }

    res.json({ duration, quiz });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});


module.exports = router;
