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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load configuration</div>
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

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              School Timetable Builder
            </h1>
            <p className="text-gray-600">
              Create and manage timetables for your school classes
            </p>
          </div>

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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Timetable for {selectedClass}</CardTitle>
                    {entries.length > 0 && (
                      <Button onClick={exportToCSV} variant="outline" size="sm">
                        Export CSV
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">Loading timetable...</div>
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
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-gray-500">
                      Select a class to view and edit its timetable
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