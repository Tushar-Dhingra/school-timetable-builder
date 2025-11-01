import React from 'react';
import { TimetableEntry } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface WeekSummaryProps {
  entries: TimetableEntry[];
  subjects: string[];
}

const WeekSummary: React.FC<WeekSummaryProps> = ({ entries, subjects }) => {
  const getSubjectCount = (subject: string) => {
    return entries.filter(entry => entry.subject === subject).length;
  };

  const getTotalPeriods = () => {
    return entries.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Total Periods: <span className="font-medium">{getTotalPeriods()}/48</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map(subject => {
              const count = getSubjectCount(subject);
              return (
                <div key={subject} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className={count === 0 ? 'text-red-600' : 'text-gray-800'}>
                    {subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${count === 0 ? 'bg-red-400' : 'bg-blue-400'}`}
                        style={{ width: `${Math.min((count / 8) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekSummary;