import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableApi } from '../lib/api';
import { TimetableEntry } from '../types';
import toast from 'react-hot-toast';

export const useTimetable = (className: string) => {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['timetable', className],
    queryFn: () => timetableApi.getClassTimetable(className),
    enabled: !!className,
  });

  const { data: coverage = {} } = useQuery({
    queryKey: ['coverage', className],
    queryFn: () => timetableApi.getSubjectCoverage(className),
    enabled: !!className,
  });

  const createEntryMutation = useMutation({
    mutationFn: timetableApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', className] });
      queryClient.invalidateQueries({ queryKey: ['coverage', className] });
      toast.success('Session added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    entries,
    coverage,
    isLoading,
    createEntry: createEntryMutation.mutate,
    isCreating: createEntryMutation.isPending,
  };
};

export const useConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: timetableApi.getConfig,
  });
};

export const useSuggestions = () => {
  const { data: suggestions = [], mutate: getSuggestions } = useMutation({
    mutationFn: timetableApi.suggestSlots,
  });

  return {
    suggestions,
    getSuggestions,
  };
};