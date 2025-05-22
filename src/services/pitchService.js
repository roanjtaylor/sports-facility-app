import { supabase } from './supabaseClient';
import { Pitch } from '../models/Pitch';

export const getPitchesByFacility = async facilityId => {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .select('*')
      .eq('facility_id', facilityId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(pitch => new Pitch(pitch));
  } catch (error) {
    console.error('Error fetching pitches:', error);
    throw error;
  }
};

export const getPitchById = async pitchId => {
  try {
    const { data, error } = await supabase.from('pitches').select('*').eq('id', pitchId).single();

    if (error) throw error;
    return new Pitch(data);
  } catch (error) {
    console.error('Error fetching pitch:', error);
    throw error;
  }
};

export const createPitch = async pitchData => {
  try {
    const { data, error } = await supabase.from('pitches').insert([pitchData]).select().single();

    if (error) throw error;
    return new Pitch(data);
  } catch (error) {
    console.error('Error creating pitch:', error);
    throw error;
  }
};

export const updatePitch = async (pitchId, updates) => {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .update(updates)
      .eq('id', pitchId)
      .select()
      .single();

    if (error) throw error;
    return new Pitch(data);
  } catch (error) {
    console.error('Error updating pitch:', error);
    throw error;
  }
};

export const deletePitch = async pitchId => {
  try {
    const { error } = await supabase.from('pitches').delete().eq('id', pitchId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting pitch:', error);
    throw error;
  }
};
