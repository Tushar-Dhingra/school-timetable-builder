import { Router } from 'express';
import {
  createOrUpdateEntry,
  getClassTimetable,
  getConfig,
  getSubjectCoverage,
  suggestSlots
} from '../controllers/timetableController';

const router = Router();

router.post('/timetable', createOrUpdateEntry);
router.get('/timetable/:className', getClassTimetable);
router.delete('/timetable/:className/:day/:period', async (req, res) => {
  try {
    const { className, day, period } = req.params;
    const { TimetableEntry } = await import('../models/TimetableEntry');
    
    await TimetableEntry.deleteOne({
      className,
      day,
      period: parseInt(period)
    });

    res.json({ success: true, data: { message: 'Entry deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
router.get('/config', getConfig);
router.get('/coverage/:className', getSubjectCoverage);
router.get('/suggest-slots', suggestSlots);

export default router;