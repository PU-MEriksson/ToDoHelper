import OpenAI from "openai";
import dotenv from 'dotenv';


dotenv.config();



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateTaskBreakdown(task) {
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that breaks down tasks into simple, clear steps."
          },
          {
            role: "user",
            content: `Please break down this task into simple steps: ${task}`
          }
        ],
        store: true,
        stream: true,
      });
  
      let fullResponse = '';
      
      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
      }
  
      // Split the response into steps and clean them up
      const steps = fullResponse
        .split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0);
  
      return steps;
  
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate task breakdown');
    }
  }

main();

//test kod
/*async function main() {
    try {
      const steps = await generateTaskBreakdown("Clean the kitchen");
      console.log(steps);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
/*/