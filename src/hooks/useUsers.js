// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '../services/userService';

export const useUserProfile = userId => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUserProfile,
    onSuccess: data => {
      queryClient.setQueryData(['users', data.id], data);
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }) => userService.updateUserProfile(userId, updates),
    onSuccess: data => {
      queryClient.setQueryData(['users', data.id], data);
    },
  });
};
