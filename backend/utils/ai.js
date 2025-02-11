import OpenAI from "openai";
import dotenv from 'dotenv';


dotenv.config();



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateTaskBreakdown(task) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "You are a helpful assistant." }],
    model: "gpt-4o-mini",
    store: true,
  });

  console.log(completion.choices[0]);
}

main();