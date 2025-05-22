-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('facility_owner', 'player')),
  date_of_birth date,
  profile_photo_url text,
  created_at timestamp with time zone default now() not null
);

-- Facilities Table
create table public.facilities (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users not null,
  name text not null,
  address text not null,
  photo_url text,
  phone text,
  is_verified boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Pitches Table
create table public.pitches (
  id uuid default uuid_generate_v4() primary key,
  facility_id uuid references public.facilities not null,
  name text not null,
  configuration jsonb not null,
  created_at timestamp with time zone default now() not null
);

-- Availability Schedule Table
create table public.availability_schedules (
  id uuid default uuid_generate_v4() primary key,
  pitch_id uuid references public.pitches not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_peak boolean default false,
  price decimal(10,2) not null,
  is_available boolean default true,
  created_at timestamp with time zone default now() not null
);

-- Bookings Table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  pitch_id uuid references public.pitches not null,
  booker_id uuid references public.users not null,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null check (status in ('pending', 'confirmed', 'rejected', 'cancelled')),
  created_at timestamp with time zone default now() not null
);

-- Lobbies Table
create table public.lobbies (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.users not null,
  pitch_id uuid references public.pitches not null,
  booking_id uuid references public.bookings,
  lobby_date date not null,
  start_time time not null,
  end_time time not null,
  min_players integer not null,
  max_players integer not null,
  status text not null check (status in ('open', 'filled', 'cancelled')),
  created_at timestamp with time zone default now() not null
);

-- Lobby Participants
create table public.lobby_participants (
  id uuid default uuid_generate_v4() primary key,
  lobby_id uuid references public.lobbies not null,
  player_id uuid references public.users not null,
  joined_at timestamp with time zone default now() not null,
  unique(lobby_id, player_id)
);

-- Player Availability Preferences
create table public.player_availability (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.users not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now() not null
);