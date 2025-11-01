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
    <Card>
      <CardHeader>
        <CardTitle>{editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <Select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {config.classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <Select
                value={formData.teacher}
                onChange={(e) => handleTeacherChange(e.target.value)}
                required
              >
                <option value="">Select Teacher</option>
                {config.teachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
              >
                <option value="">Select Subject</option>
                {config.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <Select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                required
              >
                <option value="">Select Day</option>
                {config.days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Period</label>
              <Select
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                required
              >
                <option value="">Select Period</option>
                {config.periods.map(period => (
                  <option key={period} value={period}>Period {period}</option>
                ))}
              </Select>
            </div>
          </div>

          {suggestions.length > 0 && formData.teacher && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Available Slots for {formData.teacher}:</label>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion.day} P{suggestion.period}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingEntry ? 'Update Session' : 'Add Session'}
            </Button>
            {editingEntry && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimetableForm;