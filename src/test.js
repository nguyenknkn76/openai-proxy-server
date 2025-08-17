import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateResponse = async (prompt) => {
  try {
    // const { prompt } = req.body;
    console.log(`[msg]:::req.prompt:::`,prompt);
    if (!prompt) console.log(`[error]: don't have a prompt!!!`)
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      // temperature: 1.1,
      // presence_penalty: 0,
      // frequency_penalty: 0,
    });

    console.log(`[msg]:::openai.response:::`,chatCompletion.choices[0].message.content);
    // res.json(chatCompletion.choices[0].message);

  } catch (error) {
    console.error(error);
  }
}

generateResponse(`tell me about solar system`)
