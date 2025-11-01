import React from 'react';
import { TimetableEntry } from '../types';
import { Card } from './ui/card';

interface TimetableGridProps {
  entries: TimetableEntry[];
  className: string;
  coverage: { [subject: string]: number };
  subjects: string[];
  onEdit?: (entry: TimetableEntry) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ entries, className, coverage, subjects, onEdit }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getEntry = (day: string, period: number) => {
    return entries.find(entry => entry.day === day && entry.period === period);
  };

  const getMissingSubjects = () => {
    return subjects.filter(subject => !coverage[subject] || coverage[subject] === 0);
  };

  const missingSubjects = getMissingSubjects();

  return (
    <div className="space-y-4">
      {missingSubjects.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-red-800">
            <strong>Missing Subjects:</strong> {missingSubjects.join(', ')}
          </div>
        </Card>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="p-2 font-semibold text-center bg-gray-100 rounded">Period</div>
            {days.map(day => (
              <div key={day} className="p-2 font-semibold text-center bg-gray-100 rounded">
                {day}
              </div>
            ))}
          </div>
          
          {periods.map(period => (
            <div key={period} className="grid grid-cols-7 gap-1 mb-1">
              <div className="p-2 text-center bg-gray-50 rounded font-medium">
                {period}
              </div>
              {days.map(day => {
                const entry = getEntry(day, period);
                return (
                  <div
                    key={`${day}-${period}`}
                    className={`p-2 min-h-[60px] rounded border ${
                      entry 
                        ? 'bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100' 
                        : 'bg-white border-gray-200'
                    }`}
                    onClick={() => entry && onEdit && onEdit(entry)}
                  >
                    {entry && (
                      <div className="text-xs">
                        <div className="font-medium text-blue-800">{entry.subject}</div>
                        <div className="text-gray-600">{entry.teacher}</div>
                        <div className="text-xs text-gray-500 mt-1">Click to edit</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Subject Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {subjects.map(subject => (
            <div key={subject} className="flex justify-between">
              <span className={coverage[subject] ? 'text-green-700' : 'text-red-700'}>
                {subject}
              </span>
              <span className="font-medium">
                {coverage[subject] || 0}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TimetableGrid;