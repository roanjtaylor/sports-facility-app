// src/hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bookingService from '../services/bookingService';

export const useBookingsByUser = userId => {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: () => bookingService.getBookingsByUser(userId),
    enabled: !!userId,
  });
};

export const useBookingsByPitch = pitchId => {
  return useQuery({
    queryKey: ['bookings', 'pitch', pitchId],
    queryFn: () => bookingService.getBookingsByPitch(pitchId),
    enabled: !!pitchId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', data.bookerId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pitch', data.pitchId] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }) => bookingService.updateBookingStatus(bookingId, status),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', data.bookerId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pitch', data.pitchId] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', data.bookerId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pitch', data.pitchId] });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.confirmBooking,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', data.bookerId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pitch', data.pitchId] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.rejectBooking,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', data.bookerId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'pitch', data.pitchId] });
    },
  });
};
