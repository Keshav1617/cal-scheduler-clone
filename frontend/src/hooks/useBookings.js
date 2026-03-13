import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, cancelBooking } from '../api/bookingsApi';
import { useToastStore } from '../store/toastStore';

export function useBookings(status, page = 1, limit = 10) {
  const queryClient = useQueryClient();
  const pushToast = useToastStore((s) => s.pushToast);

  const query = useQuery({
    queryKey: ['bookings', status, page, limit],
    queryFn: () => getBookings({ status, page, limit }).then((res) => res),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Booking cancelled' });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err) => {
      pushToast({ type: 'error', title: 'Error', message: err.message });
    },
  });

  return {
    ...query,
    cancelBooking: (uid) => cancelMutation.mutateAsync(uid),
  };
}

