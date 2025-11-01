import { TimetableEntry as TimetableEntryType, ValidationError } from '../types';
import { TimetableEntry } from '../models/TimetableEntry';

export class TimetableService {
  private async buildTeacherSchedule(): Promise<{ [teacher: string]: { day: string; period: number; className: string }[] }> {
    const entries = await TimetableEntry.find();
    const schedule: { [teacher: string]: { day: string; period: number; className: string }[] } = {};
    
    entries.forEach(entry => {
      if (!schedule[entry.teacher]) {
        schedule[entry.teacher] = [];
      }
      schedule[entry.teacher].push({
        day: entry.day,
        period: entry.period,
        className: entry.className
      });
    });
    
    return schedule;
  }

  async validateEntry(entry: TimetableEntryType, isUpdate: boolean = false): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Check teacher conflict
    const teacherConflict = await TimetableEntry.findOne({
      teacher: entry.teacher,
      day: entry.day,
      period: entry.period,
      className: { $ne: entry.className }
    });
    
    if (teacherConflict) {
      errors.push({
        message: `${entry.teacher} already assigned to ${teacherConflict.className} on ${entry.day}, Period ${entry.period}`,
        field: 'teacher'
      });
    }

    // Check period limit (max 8 per day) - exclude current entry if updating
    const dayPeriods = await TimetableEntry.countDocuments({
      className: entry.className,
      day: entry.day,
      ...(isUpdate ? {
        $or: [
          { period: { $ne: entry.period } },
          { subject: { $ne: entry.subject } },
          { teacher: { $ne: entry.teacher } }
        ]
      } : {})
    });
    
    if (dayPeriods >= 8) {
      errors.push({
        message: `${entry.className} already has 8 periods on ${entry.day}`,
        field: 'period'
      });
    }

    // Skip duplicate slot check if updating existing entry
    if (!isUpdate) {
      const slotConflict = await TimetableEntry.findOne({
        className: entry.className,
        day: entry.day,
        period: entry.period
      });
      
      if (slotConflict) {
        errors.push({
          message: `${entry.className} already has ${slotConflict.subject} on ${entry.day}, Period ${entry.period}`,
          field: 'period'
        });
      }
    }

    return errors;
  }

  async addEntry(entry: TimetableEntryType): Promise<ValidationError[]> {
    // Check if updating existing entry
    const existingEntry = await TimetableEntry.findOne({
      className: entry.className,
      day: entry.day,
      period: entry.period
    });

    const errors = await this.validateEntry(entry, !!existingEntry);
    if (errors.length > 0) return errors;

    // Remove existing entry for same slot if updating
    if (existingEntry) {
      await TimetableEntry.deleteOne({
        className: entry.className,
        day: entry.day,
        period: entry.period
      });
    }

    // Create new entry
    await TimetableEntry.create(entry);
    return [];
  }

  async getClassTimetable(className: string): Promise<TimetableEntryType[]> {
    const entries = await TimetableEntry.find({ className }).lean();
    return entries.map(entry => ({
      day: entry.day,
      period: entry.period,
      className: entry.className,
      subject: entry.subject,
      teacher: entry.teacher
    }));
  }

  async getAllClasses(): Promise<string[]> {
    const classes = await TimetableEntry.distinct('className');
    return classes;
  }

  async getSubjectCoverage(className: string): Promise<{ [subject: string]: number }> {
    const entries = await this.getClassTimetable(className);
    const coverage: { [subject: string]: number } = {};
    
    entries.forEach(entry => {
      coverage[entry.subject] = (coverage[entry.subject] || 0) + 1;
    });
    
    return coverage;
  }

  async suggestNextSlot(teacher: string): Promise<{ day: string; period: number }[]> {
    const teacherSchedule = await this.buildTeacherSchedule();
    const occupied = teacherSchedule[teacher] || [];
    const suggestions: { day: string; period: number }[] = [];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const periods = [1, 2, 3, 4, 5, 6, 7, 8];

    days.forEach(day => {
      periods.forEach(period => {
        const isOccupied = occupied.some(slot => slot.day === day && slot.period === period);
        if (!isOccupied) {
          suggestions.push({ day, period });
        }
      });
    });

    return suggestions.slice(0, 5);
  }
}