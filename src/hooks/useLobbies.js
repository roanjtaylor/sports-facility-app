// src/hooks/useLobbies.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lobbyService from '../services/lobbyService';

export const useLobbies = () => {
  return useQuery({
    queryKey: ['lobbies'],
    queryFn: lobbyService.getLobbies,
  });
};

export const useLobbyById = lobbyId => {
  return useQuery({
    queryKey: ['lobbies', lobbyId],
    queryFn: () => lobbyService.getLobbyById(lobbyId),
    enabled: !!lobbyId,
  });
};

export const useCreateLobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lobbyService.createLobby,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      queryClient.setQueryData(['lobbies', data.id], data);
    },
  });
};

export const useJoinLobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lobbyId, playerId }) => lobbyService.joinLobby(lobbyId, playerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      queryClient.invalidateQueries({ queryKey: ['lobbies', variables.lobbyId] });
    },
  });
};

export const useLeaveLobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lobbyId, playerId }) => lobbyService.leaveLobby(lobbyId, playerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      queryClient.invalidateQueries({ queryKey: ['lobbies', variables.lobbyId] });
    },
  });
};

export const useUpdateLobbyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lobbyId, status }) => lobbyService.updateLobbyStatus(lobbyId, status),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      queryClient.invalidateQueries({ queryKey: ['lobbies', data.id] });
    },
  });
};
