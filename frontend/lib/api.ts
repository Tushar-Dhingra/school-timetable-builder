import axios from 'axios';
import { TimetableEntry, Config, ApiResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);

export const timetableApi = {
  createEntry: async (entry: TimetableEntry): Promise<TimetableEntry> => {
    const response = await api.post<ApiResponse<TimetableEntry>>('/timetable', entry);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create entry');
    }
    return response.data.data!;
  },

  getClassTimetable: async (className: string): Promise<TimetableEntry[]> => {
    const response = await api.get<ApiResponse<TimetableEntry[]>>(`/timetable/${className}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch timetable');
    }
    return response.data.data!;
  },

  getConfig: async (): Promise<Config> => {
    const response = await api.get<ApiResponse<Config>>('/config');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch config');
    }
    return response.data.data!;
  },

  getSubjectCoverage: async (className: string): Promise<{ [subject: string]: number }> => {
    const response = await api.get<ApiResponse<{ [subject: string]: number }>>(`/coverage/${className}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch coverage');
    }
    return response.data.data!;
  },

  suggestSlots: async (teacher: string): Promise<{ day: string; period: number }[]> => {
    const response = await api.get<ApiResponse<{ day: string; period: number }[]>>(`/suggest-slots?teacher=${encodeURIComponent(teacher)}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to get suggestions');
    }
    return response.data.data!;
  },
};