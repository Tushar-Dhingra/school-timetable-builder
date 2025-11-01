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
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          📈 Week Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-semibold">📅 Total Periods Scheduled</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-900 mr-2">{getTotalPeriods()}</span>
                <span className="text-blue-600">/48</span>
              </div>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(getTotalPeriods() / 48) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              📚 Subject Distribution
            </h4>
            {subjects.map(subject => {
              const count = getSubjectCount(subject);
              const percentage = Math.min((count / 8) * 100, 100);
              return (
                <div key={subject} className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  count === 0 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        count === 0 ? 'bg-red-400' : 'bg-green-400'
                      }`}></span>
                      <span className={`font-medium ${
                        count === 0 ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {subject}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      count === 0 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {count} sessions
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${
                        count === 0 ? 'bg-red-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
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