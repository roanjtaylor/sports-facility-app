import { supabase } from './supabaseClient';
import { User } from '../models/User';

export const getUserProfile = async userId => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) throw error;
    return new User(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUserProfile = async userData => {
  try {
    const { data, error } = await supabase.from('users').insert([userData]).select().single();

    if (error) throw error;
    return new User(data);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return new User(data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
