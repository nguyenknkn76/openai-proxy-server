import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const PORT = process.env.PORT || 3001;

//! setup endpoints
app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json(chatCompletion.choices[0].message);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});