import { supabase } from './supabaseClient';
import { Facility } from '../models/Facility';

export const getFacilities = async () => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(facility => new Facility(facility));
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

export const getFacilityById = async facilityId => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facilityId)
      .single();

    if (error) throw error;
    return new Facility(data);
  } catch (error) {
    console.error('Error fetching facility:', error);
    throw error;
  }
};

export const getFacilitiesByOwner = async ownerId => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(facility => new Facility(facility));
  } catch (error) {
    console.error('Error fetching owner facilities:', error);
    throw error;
  }
};

export const createFacility = async facilityData => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert([facilityData])
      .select()
      .single();

    if (error) throw error;
    return new Facility(data);
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

export const updateFacility = async (facilityId, updates) => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', facilityId)
      .select()
      .single();

    if (error) throw error;
    return new Facility(data);
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
};

export const deleteFacility = async facilityId => {
  try {
    const { error } = await supabase.from('facilities').delete().eq('id', facilityId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};
