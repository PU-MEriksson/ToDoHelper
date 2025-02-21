import { generateTaskBreakdown } from "../utils/ai.js";

export const breakdownTask = async (req, res) => {
  try {
    const { task, detailLevel } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }
    const steps = await generateTaskBreakdown(task, detailLevel);
    res.json({ steps });
  } catch (error) {
    console.error("Error processing task:", error);
    res.status(500).json({ error: "Failed to process task" });
  }
};
