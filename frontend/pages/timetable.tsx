import React, { useState } from 'react';
import Head from 'next/head';
import { useTimetable, useConfig, useSuggestions } from '../hooks/useTimetable';
import TimetableForm from '../components/TimetableForm';
import TimetableGrid from '../components/TimetableGrid';
import WeekSummary from '../components/WeekSummary';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TimetableEntry } from '../types';

const TimetablePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const { data: config, isLoading: configLoading } = useConfig();
  const { entries, coverage, isLoading, createEntry } = useTimetable(selectedClass);
  const { suggestions, getSuggestions } = useSuggestions();

  const handleSubmit = (entry: TimetableEntry) => {
    createEntry(entry);
    setEditingEntry(null);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
  };

  const exportToCSV = () => {
    if (!entries.length) return;

    const headers = ['Day', 'Period', 'Subject', 'Teacher'];
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => 
        [entry.day, entry.period, entry.subject, entry.teacher].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedClass}-timetable.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="text-lg font-medium text-gray-700">Loading your timetable...</div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-lg text-red-600 font-medium">Failed to load configuration</div>
          <div className="text-sm text-gray-500 mt-2">Please check your connection and try again</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>School Timetable Builder</title>
        <meta name="description" content="Create and manage school timetables" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-lg">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white">
                  School Timetable Builder
                </h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                🏫 Create and manage smart timetables for your school classes with intelligent scheduling
              </p>
              <div className="flex items-center justify-center mt-4 space-x-6 text-blue-100">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Smart Conflict Detection
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  Auto Suggestions
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse"></span>
                  Real-time Updates
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <TimetableForm
                config={config}
                selectedClass={selectedClass}
                onSubmit={handleSubmit}
                onClassChange={setSelectedClass}
                suggestions={suggestions}
                onGetSuggestions={getSuggestions}
                editingEntry={editingEntry}
                onCancelEdit={() => setEditingEntry(null)}
              />
              
              {selectedClass && entries.length > 0 && (
                <WeekSummary
                  entries={entries}
                  subjects={config.subjects}
                />
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedClass ? (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-lg flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      📅 Timetable for {selectedClass}
                    </CardTitle>
                    {entries.length > 0 && (
                      <Button 
                        onClick={exportToCSV} 
                        variant="outline" 
                        size="sm"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                      >
                        📄 Export CSV
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                          <div className="text-lg font-medium text-gray-700">🔄 Loading your timetable...</div>
                          <div className="text-sm text-gray-500">Please wait while we fetch your schedule</div>
                        </div>
                      </div>
                    ) : (
                      <TimetableGrid
                        entries={entries}
                        className={selectedClass}
                        coverage={coverage}
                        subjects={config.subjects}
                        onEdit={handleEdit}
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="text-center py-16">
                    <div className="mb-6">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Ready to Build Your Timetable? 🚀
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Select a class from the form to start creating and managing your school timetable with smart scheduling features
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-200 rounded-full mr-2"></span>
                        Conflict Detection
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-green-200 rounded-full mr-2"></span>
                        Auto Suggestions
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-purple-200 rounded-full mr-2"></span>
                        CSV Export
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimetablePage;