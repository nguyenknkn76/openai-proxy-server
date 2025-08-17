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
    const msgs = [
      {
        role: 'system',
        content: 'you are a trading guru. given data on share prices over the past 3 days, write a report of no omre than 150 words describing the stock perfomance and recommending whether to buy, hold or sell.'
      },
      {
        role: 'user',
        content: `${prompt}` // can use `few shot` example to train model ### example ###
      }
    ];
    console.log(`[msg]:::req.prompt:::`,prompt);
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: msgs,
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