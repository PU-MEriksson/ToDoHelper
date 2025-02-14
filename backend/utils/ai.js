import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const detailLevelPrompts = {
  basic: "Break down this task into 3-4 simple, essential steps:",
  standard:
    "Break down this task into 5-7 clear steps with brief explanations:",
  detailed:
    "Break down this task into 8-10 detailed steps, including tips and considerations for each step:",
};

export async function generateTaskBreakdown(task, detailLevel = "standard") {
  try {
    const prompt =
      detailLevelPrompts[detailLevel] || detailLevelPrompts.standard;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a task breakdown assistant that provides ${detailLevel} level instructions. ${
            detailLevel === "detailed"
              ? "Include helpful tips and considerations."
              : detailLevel === "basic"
              ? "Keep it simple and concise."
              : "Provide clear, straightforward steps."
          }`,
        },
        {
          role: "user",
          content: `${prompt} ${task}`,
        },
      ],

      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    const steps = fullResponse
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step.length > 0);

    return steps;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate task breakdown");
  }
}

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
