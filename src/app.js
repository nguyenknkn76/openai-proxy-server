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
app.get('/', async (req, res) => {
  res.json({msg: "Hello from openai-proxy-server!"});
});

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(`[msg]:::req.prompt:::`,prompt);
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      // temperature: 1.1,
      // presence_penalty: 0,
      // frequency_penalty: 0,
    });

    console.log(`[msg]:::openai.response:::`,chatCompletion.choices[0].message);
    res.json(chatCompletion.choices[0].message);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});