import { supabase } from './supabaseClient';
import { AvailabilitySchedule } from '../models/AvailabilitySchedule';
import { PlayerAvailability } from '../models/PlayerAvailability';

export const getAvailabilityByPitch = async pitchId => {
  try {
    const { data, error } = await supabase
      .from('availability_schedules')
      .select('*')
      .eq('pitch_id', pitchId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data.map(schedule => new AvailabilitySchedule(schedule));
  } catch (error) {
    console.error('Error fetching pitch availability:', error);
    throw error;
  }
};

export const createAvailabilitySchedule = async scheduleData => {
  try {
    const { data, error } = await supabase
      .from('availability_schedules')
      .insert([scheduleData])
      .select()
      .single();

    if (error) throw error;
    return new AvailabilitySchedule(data);
  } catch (error) {
    console.error('Error creating availability schedule:', error);
    throw error;
  }
};

export const getPlayerAvailability = async playerId => {
  try {
    const { data, error } = await supabase
      .from('player_availability')
      .select('*')
      .eq('player_id', playerId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data.map(availability => new PlayerAvailability(availability));
  } catch (error) {
    console.error('Error fetching player availability:', error);
    throw error;
  }
};

export const setPlayerAvailability = async availabilityData => {
  try {
    const { data, error } = await supabase
      .from('player_availability')
      .insert([availabilityData])
      .select()
      .single();

    if (error) throw error;
    return new PlayerAvailability(data);
  } catch (error) {
    console.error('Error setting player availability:', error);
    throw error;
  }
};

export const updatePlayerAvailability = async (availabilityId, updates) => {
  try {
    const { data, error } = await supabase
      .from('player_availability')
      .update(updates)
      .eq('id', availabilityId)
      .select()
      .single();

    if (error) throw error;
    return new PlayerAvailability(data);
  } catch (error) {
    console.error('Error updating player availability:', error);
    throw error;
  }
};

export const deletePlayerAvailability = async availabilityId => {
  try {
    const { error } = await supabase.from('player_availability').delete().eq('id', availabilityId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting player availability:', error);
    throw error;
  }
};
