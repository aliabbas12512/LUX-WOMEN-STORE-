-- Orders table for the storefront. Run in Supabase → SQL Editor.
-- The website writes with the service-role key from the server only;
-- Row Level Security blocks all access with the public (anon) key.

create table if not exists public.orders (
  id            bigint generated always as identity primary key,
  reference     text        not null unique,
  created_at    timestamptz not null default now(),
  status        text        not null default 'new'
                check (status in ('new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
  customer_name  text not null,
  customer_phone text not null,
  city           text not null,
  district       text not null,
  address        text not null,
  notes          text,
  items          jsonb   not null,
  subtotal       numeric(10, 2) not null,
  delivery_fee   numeric(10, 2) not null,
  total          numeric(10, 2) not null,
  currency       text not null default 'SAR',
  source         jsonb
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;
-- No policies are created on purpose: only the service role (server) can read/write.
