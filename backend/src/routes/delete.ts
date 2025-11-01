import { Router } from 'express';
import { TimetableEntry } from '../models/TimetableEntry';
import { ApiResponse } from '../types';

const router = Router();

router.delete('/timetable/:className/:day/:period', async (req, res) => {
  try {
    const { className, day, period } = req.params;
    
    await TimetableEntry.deleteOne({
      className,
      day,
      period: parseInt(period)
    });

    res.json({
      success: true,
      data: { message: 'Entry deleted successfully' }
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;