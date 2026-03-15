const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('chatbot');
});

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'gemma3:1b',
      prompt: prompt,
      stream: false
    });

    res.json({ reply: response.data.response });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});

module.exports = router;
