export interface TimetableEntry {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  period: number; // 1–8
  className: string;
  subject: string;
  teacher: string;
}

export interface ValidationError {
  message: string;
  field?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ClassTimetable {
  [key: string]: TimetableEntry[]; // className -> entries
}

export interface TeacherSchedule {
  [key: string]: { day: string; period: number; className: string }[]; // teacher -> schedule
}