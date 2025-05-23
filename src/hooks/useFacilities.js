// src/hooks/useFacilities.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as facilityService from '../services/facilityService';

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: facilityService.getFacilities,
  });
};

export const useFacilityById = facilityId => {
  return useQuery({
    queryKey: ['facilities', facilityId],
    queryFn: () => facilityService.getFacilityById(facilityId),
    enabled: !!facilityId,
  });
};

export const useFacilitiesByOwner = ownerId => {
  return useQuery({
    queryKey: ['facilities', 'owner', ownerId],
    queryFn: () => facilityService.getFacilitiesByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: facilityService.createFacility,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', 'owner', data.ownerId] });
      queryClient.setQueryData(['facilities', data.id], data);
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facilityId, updates }) => facilityService.updateFacility(facilityId, updates),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', 'owner', data.ownerId] });
      queryClient.setQueryData(['facilities', data.id], data);
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: facilityService.deleteFacility,
    onSuccess: (_, facilityId) => {
      queryClient.removeQueryData(['facilities', facilityId]);
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', 'owner'] });
    },
  });
};
