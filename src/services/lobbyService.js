import { supabase } from './supabaseClient';
import { Lobby } from '../models/Lobby';

export const getLobbies = async () => {
  try {
    const { data, error } = await supabase
      .from('lobbies')
      .select(
        `
        *,
        participants:lobby_participants(
          id,
          player_id,
          joined_at
        )
      `
      )
      .order('lobby_date', { ascending: true });

    if (error) throw error;
    return data.map(lobby => new Lobby(lobby));
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    throw error;
  }
};

export const getLobbyById = async lobbyId => {
  try {
    const { data, error } = await supabase
      .from('lobbies')
      .select(
        `
        *,
        participants:lobby_participants(
          id,
          player_id,
          joined_at
        )
      `
      )
      .eq('id', lobbyId)
      .single();

    if (error) throw error;
    return new Lobby(data);
  } catch (error) {
    console.error('Error fetching lobby:', error);
    throw error;
  }
};

export const createLobby = async lobbyData => {
  try {
    const { data, error } = await supabase.from('lobbies').insert([lobbyData]).select().single();

    if (error) throw error;
    return new Lobby(data);
  } catch (error) {
    console.error('Error creating lobby:', error);
    throw error;
  }
};

export const joinLobby = async (lobbyId, playerId) => {
  try {
    const { data, error } = await supabase
      .from('lobby_participants')
      .insert([{ lobby_id: lobbyId, player_id: playerId }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error joining lobby:', error);
    throw error;
  }
};

export const leaveLobby = async (lobbyId, playerId) => {
  try {
    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .eq('lobby_id', lobbyId)
      .eq('player_id', playerId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error leaving lobby:', error);
    throw error;
  }
};

export const updateLobbyStatus = async (lobbyId, status) => {
  try {
    const { data, error } = await supabase
      .from('lobbies')
      .update({ status })
      .eq('id', lobbyId)
      .select()
      .single();

    if (error) throw error;
    return new Lobby(data);
  } catch (error) {
    console.error('Error updating lobby status:', error);
    throw error;
  }
};
