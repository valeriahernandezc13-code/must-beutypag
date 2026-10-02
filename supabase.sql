-- Pega esto en Supabase > SQL Editor > Run
create table products (
  id bigint generated always as identity primary key,
  name text not null,
  category text default '',
  price integer not null default 0,
  stock integer not null default 0,
  image text default '',
  description text default '',
  variants jsonb not null default '[]',
  active boolean not null default true,
  created_at timestamptz default now()
);
alter table products enable row level security;
create policy "ver activos" on products for select using (active = true or auth.role() = 'authenticated');
create policy "admin inserta" on products for insert to authenticated with check (true);
create policy "admin edita" on products for update to authenticated using (true);
create policy "admin borra" on products for delete to authenticated using (true);

insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "fotos publicas" on storage.objects for select using (bucket_id = 'products');
create policy "admin sube fotos" on storage.objects for insert to authenticated with check (bucket_id = 'products');
create policy "admin borra fotos" on storage.objects for delete to authenticated using (bucket_id = 'products');
