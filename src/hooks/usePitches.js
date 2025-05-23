// src/hooks/usePitches.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as pitchService from '../services/pitchService';

export const usePitchesByFacility = facilityId => {
  return useQuery({
    queryKey: ['pitches', 'facility', facilityId],
    queryFn: () => pitchService.getPitchesByFacility(facilityId),
    enabled: !!facilityId,
  });
};

export const usePitchById = pitchId => {
  return useQuery({
    queryKey: ['pitches', pitchId],
    queryFn: () => pitchService.getPitchById(pitchId),
    enabled: !!pitchId,
  });
};

export const useCreatePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pitchService.createPitch,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['pitches', 'facility', data.facilityId] });
      queryClient.setQueryData(['pitches', data.id], data);
    },
  });
};

export const useUpdatePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pitchId, updates }) => pitchService.updatePitch(pitchId, updates),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['pitches', 'facility', data.facilityId] });
      queryClient.setQueryData(['pitches', data.id], data);
    },
  });
};

export const useDeletePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pitchService.deletePitch,
    onSuccess: (_, pitchId) => {
      queryClient.removeQueryData(['pitches', pitchId]);
      queryClient.invalidateQueries({ queryKey: ['pitches', 'facility'] });
    },
  });
};
