-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_availability ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Facilities policies
CREATE POLICY "Anyone can view facilities" 
ON public.facilities FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Facility owners can create facilities" 
ON public.facilities FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'facility_owner');

CREATE POLICY "Facility owners can update their facilities" 
ON public.facilities FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Facility owners can delete their facilities" 
ON public.facilities FOR DELETE 
USING (owner_id = auth.uid());

-- Pitches policies
CREATE POLICY "Anyone can view pitches" 
ON public.pitches FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Facility owners can manage their pitches" 
ON public.pitches FOR ALL 
TO authenticated 
USING ((SELECT owner_id FROM public.facilities WHERE id = facility_id) = auth.uid());

-- Availability schedules policies
CREATE POLICY "Anyone can view availability schedules" 
ON public.availability_schedules FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Facility owners can manage their pitch schedules" 
ON public.availability_schedules FOR ALL 
TO authenticated 
USING ((SELECT f.owner_id FROM public.facilities f JOIN public.pitches p ON f.id = p.facility_id WHERE p.id = pitch_id) = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (booker_id = auth.uid());

CREATE POLICY "Facility owners can view bookings for their pitches" 
ON public.bookings FOR SELECT 
USING ((SELECT f.owner_id FROM public.facilities f JOIN public.pitches p ON f.id = p.facility_id WHERE p.id = pitch_id) = auth.uid());

CREATE POLICY "Authenticated users can create bookings" 
ON public.bookings FOR INSERT 
TO authenticated 
WITH CHECK (booker_id = auth.uid());

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE 
USING (booker_id = auth.uid());

CREATE POLICY "Facility owners can update bookings for their pitches" 
ON public.bookings FOR UPDATE 
USING ((SELECT f.owner_id FROM public.facilities f JOIN public.pitches p ON f.id = p.facility_id WHERE p.id = pitch_id) = auth.uid());

-- Lobbies policies
CREATE POLICY "Anyone can view lobbies" 
ON public.lobbies FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can create lobbies" 
ON public.lobbies FOR INSERT 
TO authenticated 
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Lobby creators can update their lobbies" 
ON public.lobbies FOR UPDATE 
USING (creator_id = auth.uid());

CREATE POLICY "Lobby creators can delete their lobbies" 
ON public.lobbies FOR DELETE 
USING (creator_id = auth.uid());

-- Lobby participants policies
CREATE POLICY "Anyone can view lobby participants" 
ON public.lobby_participants FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Users can join lobbies" 
ON public.lobby_participants FOR INSERT 
TO authenticated 
WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can leave lobbies" 
ON public.lobby_participants FOR DELETE 
USING (player_id = auth.uid());

-- Player availability policies
CREATE POLICY "Users can view their own availability" 
ON public.player_availability FOR SELECT 
USING (player_id = auth.uid());

CREATE POLICY "Users can manage their own availability" 
ON public.player_availability FOR ALL 
USING (player_id = auth.uid()) 
WITH CHECK (player_id = auth.uid());