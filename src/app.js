import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/ed554d0f73c58e9f5e2d545041933e7a/cloudflare-openai-gateway/openai`
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
        content: `
          You are a trading expert. Based on the stock price data from the last 3 days, please write a report of no more than 150 words describing the stock's performance and advising whether to buy, hold, or sell.  
          The answer must strictly follow this format:  
            [STOCK_CODE - COMPANY_NAME] - <report 2–3 sentences>. Recommendation: <BUY/HOLD/SELL>
        `
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
      temperature: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      max_tokens: 150
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