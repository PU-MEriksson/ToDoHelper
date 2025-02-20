import openai from "../config/openai.js";

const detailLevelPrompts = {
  basic: "Break down this task into 3-4 simple, essential steps:",
  standard:
    "Break down this task into 5-7 clear steps with brief explanations:",
  detailed:
    "Break down this task into 8-10 detailed steps, including tips and considerations for each step:",
};

const systemInstructions = {
  basic:
    "You are a Swedish task breakdown assistant. Respond with simple and concise steps, no markdown, no introductions.",
  standard:
    "You are a Swedish task breakdown assistant. Respond with clear and straightforward steps, no markdown, no introductions.",
  detailed:
    "You are a Swedish task breakdown assistant. Respond with detailed steps including tips and considerations, no markdown, no introductions.",
};

export async function generateTaskBreakdown(task, detailLevel = "standard") {
  if (!task) {
    throw new Error("No task provided.");
  }

  try {
    const prompt =
      detailLevelPrompts[detailLevel] || detailLevelPrompts.standard;
    const systemMessage =
      systemInstructions[detailLevel] || systemInstructions.standard;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `${prompt} ${task}` },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    return fullResponse
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step.length > 0)
      .map((step) => step.replace(/^\d+\.\s*/, "").trim()); // Tar bort numrering
  } catch (error) {
    console.error("OpenAI API error:", error);
    if (error.response) {
      console.error("API response error:", error.response.data);
    }
    throw new Error("Failed to generate task breakdown. Please try again.");
  }
}
