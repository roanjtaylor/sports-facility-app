-- Performance indexes for common queries
-- Facilities indexes
CREATE INDEX IF NOT EXISTS idx_facilities_owner_id ON facilities(owner_id);
CREATE INDEX IF NOT EXISTS idx_facilities_created_at ON facilities(created_at);

-- Pitches indexes
CREATE INDEX IF NOT EXISTS idx_pitches_facility_id ON pitches(facility_id);

-- Availability schedules indexes
CREATE INDEX IF NOT EXISTS idx_availability_schedules_pitch_id ON availability_schedules(pitch_id);
CREATE INDEX IF NOT EXISTS idx_availability_schedules_day_of_week ON availability_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_schedules_available ON availability_schedules(is_available);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_pitch_id ON bookings(pitch_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booker_id ON bookings(booker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(booking_date, status);

-- Lobbies indexes
CREATE INDEX IF NOT EXISTS idx_lobbies_pitch_id ON lobbies(pitch_id);
CREATE INDEX IF NOT EXISTS idx_lobbies_creator_id ON lobbies(creator_id);
CREATE INDEX IF NOT EXISTS idx_lobbies_date ON lobbies(lobby_date);
CREATE INDEX IF NOT EXISTS idx_lobbies_status ON lobbies(status);
CREATE INDEX IF NOT EXISTS idx_lobbies_date_status ON lobbies(lobby_date, status);

-- Lobby participants indexes
CREATE INDEX IF NOT EXISTS idx_lobby_participants_lobby_id ON lobby_participants(lobby_id);
CREATE INDEX IF NOT EXISTS idx_lobby_participants_player_id ON lobby_participants(player_id);

-- Player availability indexes
CREATE INDEX IF NOT EXISTS idx_player_availability_player_id ON player_availability(player_id);
CREATE INDEX IF NOT EXISTS idx_player_availability_day_of_week ON player_availability(day_of_week);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_bookings_pitch_date_status ON bookings(pitch_id, booking_date, status);
CREATE INDEX IF NOT EXISTS idx_lobbies_pitch_date_status ON lobbies(pitch_id, lobby_date, status);
CREATE INDEX IF NOT EXISTS idx_availability_pitch_day_available ON availability_schedules(pitch_id, day_of_week, is_available);