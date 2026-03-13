import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '../store/toastStore';
import {
  getEventTypes,
  createEventType as apiCreate,
  updateEventType as apiUpdate,
  deleteEventType as apiDelete,
} from '../api/eventTypesApi';

export function useEventTypes() {
  const queryClient = useQueryClient();
  const pushToast = useToastStore((s) => s.pushToast);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event-types'],
    queryFn: () => getEventTypes().then((res) => res.data || []),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => apiCreate(payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
    },
    onError: (err) => {
      pushToast({ type: 'error', title: 'Error', message: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: payload }) => apiUpdate(id, payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
    },
    onError: (err) => {
      pushToast({ type: 'error', title: 'Error', message: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
    },
    onError: (err) => {
      pushToast({ type: 'error', title: 'Error', message: err.message });
    },
  });

  const eventTypes = data || [];

  return {
    eventTypes,
    isLoading,
    error,
    refetch,
    createEventType: (payload) => createMutation.mutateAsync(payload),
    updateEventType: (id, payload) => updateMutation.mutateAsync({ id, data: payload }),
    deleteEventType: (id) => deleteMutation.mutateAsync(id),
  };
}

