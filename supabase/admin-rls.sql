-- Ejecutar en Supabase SQL Editor.
-- La UI también comprueba el correo, pero RLS es la protección real.

-- Quién administra se guarda por id de usuario, no por correo: así la
-- administradora puede cambiar su correo desde el panel sin perder el acceso.
-- Para dar acceso a otra cuenta: insert into public.administradores (user_id)
-- select id from auth.users where email = '<correo>';
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

-- Sin políticas: nadie la lee ni la escribe desde el navegador. Solo la
-- consulta es_admin(), que corre con los permisos de su dueño.
alter table public.administradores enable row level security;

insert into public.administradores (user_id)
select id from auth.users where email = 'admin@marao.co'
on conflict do nothing;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores where user_id = auth.uid()
  )
$$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;

alter table public.productos enable row level security;

drop policy if exists "Public can read visible products" on public.productos;
drop policy if exists "Admin can update products" on public.productos;

create policy "Public can read visible products"
on public.productos for select
to anon, authenticated
using (estado <> 'oculto' or public.es_admin());

create policy "Admin can update products"
on public.productos for update
to authenticated
using (public.es_admin())
with check (public.es_admin());

-- El panel también crea y borra productos (CRUD completo). Igual que el update,
-- solo la cuenta administradora.
drop policy if exists "Admin can insert products" on public.productos;
drop policy if exists "Admin can delete products" on public.productos;

create policy "Admin can insert products"
on public.productos for insert
to authenticated
with check (public.es_admin());

create policy "Admin can delete products"
on public.productos for delete
to authenticated
using (public.es_admin());

-- Storage del bucket "productos".
-- La lectura es pública porque el catálogo sirve las fotos por URL directa;
-- escribir solo puede la cuenta administradora. El panel sube desde el
-- navegador con su sesión, nunca con la clave de servicio.

drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

create policy "Public can read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'productos');

create policy "Admin can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'productos'
  and public.es_admin()
);

create policy "Admin can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'productos'
  and public.es_admin()
)
with check (
  bucket_id = 'productos'
  and public.es_admin()
);

create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'productos'
  and public.es_admin()
);
