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

-- El panel también crea y borra productos (CRUD completo). Igual que el update,
-- solo la cuenta administradora.
drop policy if exists "Admin can insert products" on public.productos;
drop policy if exists "Admin can delete products" on public.productos;

create policy "Admin can insert products"
on public.productos for insert
to authenticated
with check (auth.jwt() ->> 'email' = 'admin@marao.com');

create policy "Admin can delete products"
on public.productos for delete
to authenticated
using (auth.jwt() ->> 'email' = 'admin@marao.com');

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
  and auth.jwt() ->> 'email' = 'admin@marao.com'
);

create policy "Admin can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'productos'
  and auth.jwt() ->> 'email' = 'admin@marao.com'
)
with check (
  bucket_id = 'productos'
  and auth.jwt() ->> 'email' = 'admin@marao.com'
);

create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'productos'
  and auth.jwt() ->> 'email' = 'admin@marao.com'
);
