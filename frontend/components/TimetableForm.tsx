import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { TimetableEntry, Config } from '../types';

interface TimetableFormProps {
  config: Config;
  selectedClass: string;
  onSubmit: (entry: TimetableEntry) => void;
  onClassChange: (className: string) => void;
  suggestions: { day: string; period: number }[];
  onGetSuggestions: (teacher: string) => void;
  editingEntry?: TimetableEntry | null;
  onCancelEdit?: () => void;
}

const TimetableForm: React.FC<TimetableFormProps> = ({
  config,
  selectedClass,
  onSubmit,
  onClassChange,
  suggestions,
  onGetSuggestions,
  editingEntry,
  onCancelEdit
}) => {
  const [formData, setFormData] = useState({
    day: '',
    period: '',
    subject: '',
    teacher: ''
  });

  // Pre-fill form when editing
  React.useEffect(() => {
    if (editingEntry) {
      setFormData({
        day: editingEntry.day,
        period: editingEntry.period.toString(),
        subject: editingEntry.subject,
        teacher: editingEntry.teacher
      });
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.day || !formData.period || !formData.subject || !formData.teacher) {
      return;
    }

    const entry: TimetableEntry = {
      day: formData.day as TimetableEntry['day'],
      period: parseInt(formData.period),
      className: selectedClass,
      subject: formData.subject,
      teacher: formData.teacher
    };

    onSubmit(entry);
    setFormData({ day: '', period: '', subject: '', teacher: '' });
  };

  const handleTeacherChange = (teacher: string) => {
    setFormData(prev => ({ ...prev, teacher }));
    if (teacher) {
      onGetSuggestions(teacher);
    }
  };

  const applySuggestion = (suggestion: { day: string; period: number }) => {
    setFormData(prev => ({
      ...prev,
      day: suggestion.day,
      period: suggestion.period.toString()
    }));
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3">
            {editingEntry ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          {editingEntry ? '✏️ Edit Timetable Entry' : '➕ Add New Session'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-indigo-600 transition-colors">
                🏫 Class
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                required
                className="transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Choose your class...</option>
                {config.classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </Select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-indigo-600 transition-colors">
                👩‍🏫 Teacher
              </label>
              <Select
                value={formData.teacher}
                onChange={(e) => handleTeacherChange(e.target.value)}
                required
                className="transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Choose teacher...</option>
                {config.teachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </Select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-indigo-600 transition-colors">
                📚 Subject
              </label>
              <Select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
                className="transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Choose subject...</option>
                {config.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-indigo-600 transition-colors">
                📅 Day
              </label>
              <Select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                required
                className="transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Choose day...</option>
                {config.days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 group-hover:text-indigo-600 transition-colors">
                ⏰ Period
              </label>
              <Select
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                required
                className="transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Choose period...</option>
                {config.periods.map(period => (
                  <option key={period} value={period}>Period {period}</option>
                ))}
              </Select>
            </div>
          </div>

          {suggestions.length > 0 && formData.teacher && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <label className="block text-sm font-semibold mb-3 text-green-800 flex items-center">
                ✨ Smart Suggestions for {formData.teacher}
                <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                  {suggestions.length} available
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="bg-white hover:bg-green-100 border-green-300 text-green-700 hover:border-green-400 transition-all duration-200 transform hover:scale-105"
                  >
                    📅 {suggestion.day} P{suggestion.period}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {editingEntry ? '✅ Update Session' : '➕ Add Session'}
            </Button>
            {editingEntry && onCancelEdit && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancelEdit}
                className="px-6 py-3 border-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-all duration-200 transform hover:scale-105"
              >
                ❌ Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimetableForm;