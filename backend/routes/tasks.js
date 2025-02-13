import express from 'express';
import { generateTaskBreakdown} from '../utils/ai.js';

const router = express.Router();



router.post('/breakdown', async (req, res) => {
    try {
      const { task } = req.body;
      if (!task) {
        return res.status(400).json({ error: 'Task is required' });
      }
      const steps = await generateTaskBreakdown(task);
      res.json({ steps });
    } catch (error) {
      console.error('Error processing task:', error);
      res.status(500).json({ error: 'Failed to process task' });
    }
  });
    
  export default router;