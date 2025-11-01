export interface TimetableEntry {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  period: number;
  className: string;
  subject: string;
  teacher: string;
}

export interface Config {
  classes: string[];
  subjects: string[];
  teachers: string[];
  periods: number[];
  days: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}