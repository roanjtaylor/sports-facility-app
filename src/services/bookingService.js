import { supabase } from './supabaseClient';
import { Booking } from '../models/Booking';

export const getBookingsByUser = async userId => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booker_id', userId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data.map(booking => new Booking(booking));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const getBookingsByPitch = async pitchId => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('pitch_id', pitchId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data.map(booking => new Booking(booking));
  } catch (error) {
    console.error('Error fetching pitch bookings:', error);
    throw error;
  }
};

export const createBooking = async bookingData => {
  try {
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();

    if (error) throw error;
    return new Booking(data);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return new Booking(data);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async bookingId => {
  return updateBookingStatus(bookingId, 'cancelled');
};

export const confirmBooking = async bookingId => {
  return updateBookingStatus(bookingId, 'confirmed');
};

export const rejectBooking = async bookingId => {
  return updateBookingStatus(bookingId, 'rejected');
};
