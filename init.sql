-- Create users table (extended from auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  username text unique not null,
  email text,
  subscription_tier text default 'pro',
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Create applications table for Kanban board
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  company text not null,
  job_title text not null,
  status text not null default 'wishlist', -- wishlist, applied, interview, offer, rejected
  job_description_url text,
  tailored_cv_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.applications enable row level security;

create policy "Users can view own applications" on public.applications
  for select using (auth.uid() = user_id);

create policy "Users can insert own applications" on public.applications
  for insert with check (auth.uid() = user_id);

create policy "Users can update own applications" on public.applications
  for update using (auth.uid() = user_id);

create policy "Users can delete own applications" on public.applications
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
