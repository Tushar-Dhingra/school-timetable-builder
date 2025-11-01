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
    <div className="space-y-6">
      {missingSubjects.length > 0 && (
        <Card className="p-4 border-0 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg animate-pulse">
          <div className="flex items-center text-red-800">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              ⚠️
            </div>
            <div>
              <strong className="text-red-900">Missing Subjects Alert!</strong>
              <div className="text-sm mt-1">{missingSubjects.join(', ')}</div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-2 mb-4">
            <div className="p-3 font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md">
              ⏰ Period
            </div>
            {days.map(day => (
              <div key={day} className="p-3 font-bold text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md">
                {day}
              </div>
            ))}
          </div>
          
          {periods.map(period => (
            <div key={period} className="grid grid-cols-7 gap-2 mb-2">
              <div className="p-3 text-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg font-bold text-gray-700 shadow-sm">
                {period}
              </div>
              {days.map(day => {
                const entry = getEntry(day, period);
                return (
                  <div
                    key={`${day}-${period}`}
                    className={`p-3 min-h-[80px] rounded-lg border-2 transition-all duration-200 ${
                      entry 
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 cursor-pointer hover:shadow-lg hover:scale-105 transform' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => entry && onEdit && onEdit(entry)}
                  >
                    {entry ? (
                      <div className="text-xs h-full flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-blue-900 mb-1">📚 {entry.subject}</div>
                          <div className="text-gray-700 font-medium">👩🏫 {entry.teacher}</div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-2 opacity-75">
                          ✏️ Click to edit
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-2xl mb-1">➕</div>
                          <div className="text-xs">Empty</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
          📈 Subject Coverage Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => {
            const count = coverage[subject] || 0;
            const isComplete = count > 0;
            return (
              <div key={subject} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isComplete 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:shadow-md'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                      isComplete ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className={`font-medium ${
                      isComplete ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {subject}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isComplete 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {count} {count === 1 ? 'session' : 'sessions'}
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isComplete ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TimetableGrid;