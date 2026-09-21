-- Ejecutar en Supabase SQL Editor.
-- La UI también comprueba el correo, pero RLS es la protección real.

alter table public.productos enable row level security;

drop policy if exists "Public can read visible products" on public.productos;
drop policy if exists "Admin can update products" on public.productos;

create policy "Public can read visible products"
on public.productos for select
to anon, authenticated
using (estado <> 'oculto' or auth.jwt() ->> 'email' = 'admin@marao.com');

create policy "Admin can update products"
on public.productos for update
to authenticated
using (auth.jwt() ->> 'email' = 'admin@marao.com')
with check (auth.jwt() ->> 'email' = 'admin@marao.com');
