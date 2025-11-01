import { Request, Response } from 'express';
import { TimetableService } from '../services/timetableService';
import { TimetableEntry, ApiResponse } from '../types';
import config from '../data/config.json';

const timetableService = new TimetableService();

export const createOrUpdateEntry = async (req: Request, res: Response) => {
  try {
    const entry: TimetableEntry = req.body;
    
    // Basic validation
    if (!entry.day || !entry.period || !entry.className || !entry.subject || !entry.teacher) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      } as ApiResponse);
    }

    if (entry.period < 1 || entry.period > 8) {
      return res.status(400).json({
        success: false,
        error: 'Period must be between 1 and 8'
      } as ApiResponse);
    }

    const errors = await timetableService.addEntry(entry);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors[0].message
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: entry
    } as ApiResponse<TimetableEntry>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getClassTimetable = async (req: Request, res: Response) => {
  try {
    const { className } = req.params;
    const timetable = await timetableService.getClassTimetable(className);
    
    res.json({
      success: true,
      data: timetable
    } as ApiResponse<TimetableEntry[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getConfig = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: config
  } as ApiResponse);
};

export const getSubjectCoverage = async (req: Request, res: Response) => {
  try {
    const { className } = req.params;
    const coverage = await timetableService.getSubjectCoverage(className);
    
    res.json({
      success: true,
      data: coverage
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const suggestSlots = async (req: Request, res: Response) => {
  try {
    const { teacher } = req.query;
    
    if (!teacher || typeof teacher !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Teacher parameter is required'
      } as ApiResponse);
    }

    const suggestions = await timetableService.suggestNextSlot(teacher);
    
    res.json({
      success: true,
      data: suggestions
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};