// src/utils/dbHelpers.js
/**
 * Database helper utilities for error handling and validation
 */

/**
 * Handles database errors with consistent logging and user-friendly messages
 * @param {Error} error - The error object from Supabase
 * @param {string} operation - Description of the operation that failed
 * @throws {Error} - Throws a new error with user-friendly message
 */
export const handleDbError = (error, operation) => {
  console.error(`Database error during ${operation}:`, error);
  
  // Map common Supabase error codes to user-friendly messages
  const errorMessages = {
    23505: 'This record already exists',
    23503: 'Referenced record not found',
    42501: 'Insufficient permissions',
    42P01: 'Table or view does not exist',
    22001: 'Input value is too long',
    23514: 'Invalid input value',
  };
  
  const code = error?.code;
  const userMessage = errorMessages[code] || error?.message || 'An unexpected error occurred';
  
  throw new Error(`Failed to ${operation}: ${userMessage}`);
};

/**
 * Validates that required fields are present in data object
 * @param {Object} data - The data object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @throws {Error} - Throws error if any required fields are missing
 */
export const validateRequired = (data, requiredFields) => {
  const missing = requiredFields.filter(field => 
    data[field] === undefined || 
    data[field] === null || 
    data[field] === ''
  );
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @throws {Error} - Throws error if email format is invalid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

/**
 * Validates date format and ensures it's not in the past
 * @param {string|Date} date - Date to validate
 * @param {boolean} allowPast - Whether to allow past dates (default: false)
 * @throws {Error} - Throws error if date is invalid or in the past
 */
export const validateDate = (date, allowPast = false) => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }
  
  if (!allowPast && dateObj < new Date()) {
    throw new Error('Date cannot be in the past');
  }
};

/**
 * Validates time format (HH:MM)
 * @param {string} time - Time string to validate
 * @throws {Error} - Throws error if time format is invalid
 */
export const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    throw new Error('Invalid time format. Use HH:MM format');
  }
};

/**
 * Validates that end time is after start time
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @throws {Error} - Throws error if end time is not after start time
 */
export const validateTimeRange = (startTime, endTime) => {
  validateTime(startTime);
  validateTime(endTime);
  
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  if (end <= start) {
    throw new Error('End time must be after start time');
  }
};

/**
 * Validates user role
 * @param {string} role - User role to validate
 * @throws {Error} - Throws error if role is invalid
 */
export const validateUserRole = (role) => {
  const validRoles = ['facility_owner', 'player'];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid user role. Must be one of: ${validRoles.join(', ')}`);
  }
};

/**
 * Validates booking status
 * @param {string} status - Booking status to validate
 * @throws {Error} - Throws error if status is invalid
 */
export const validateBookingStatus = (status) => {
  const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid booking status. Must be one of: ${validStatuses.join(', ')}`);
  }
};

/**
 * Validates lobby status
 * @param {string} status - Lobby status to validate
 * @throws {Error} - Throws error if status is invalid
 */
export const validateLobbyStatus = (status) => {
  const validStatuses = ['open', 'filled', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid lobby status. Must be one of: ${validStatuses.join(', ')}`);
  }
};

/**
 * Validates day of week (0-6)
 * @param {number} dayOfWeek - Day of week to validate
 * @throws {Error} - Throws error if day of week is invalid
 */
export const validateDayOfWeek = (dayOfWeek) => {
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('Day of week must be an integer between 0 (Sunday) and 6 (Saturday)');
  }
};

/**
 * Sanitizes string input by trimming whitespace
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (str) => {
  return typeof str === 'string' ? str.trim() : str;
};

/**
 * Formats error message for user display
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};