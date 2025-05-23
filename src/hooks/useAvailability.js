// src/hooks/useAvailability.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as availabilityService from '../services/availabilityService';

export const useAvailabilityByPitch = pitchId => {
  return useQuery({
    queryKey: ['availability', 'pitch', pitchId],
    queryFn: () => availabilityService.getAvailabilityByPitch(pitchId),
    enabled: !!pitchId,
  });
};

export const useCreateAvailabilitySchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.createAvailabilitySchedule,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'pitch', data.pitchId] });
    },
  });
};

export const usePlayerAvailability = playerId => {
  return useQuery({
    queryKey: ['playerAvailability', playerId],
    queryFn: () => availabilityService.getPlayerAvailability(playerId),
    enabled: !!playerId,
  });
};

export const useSetPlayerAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.setPlayerAvailability,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['playerAvailability', data.playerId] });
    },
  });
};

export const useUpdatePlayerAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ availabilityId, updates }) =>
      availabilityService.updatePlayerAvailability(availabilityId, updates),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['playerAvailability', data.playerId] });
    },
  });
};

export const useDeletePlayerAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.deletePlayerAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerAvailability'] });
    },
  });
};
