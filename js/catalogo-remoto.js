import { exigirSupabase } from "./supabase.js";

const CAMPOS_PRODUCTO =
  "id, nombre, descripcion, precio, tipo, color, cobertura, borde, efecto, alias, presentaciones, imagen, imagenes, estado, orden, categoria_id";

/**
 * Carga productos visibles. Los agotados siguen apareciendo para informar al
 * cliente; los ocultos solo deben aparecer en el panel administrativo.
 */
export async function cargarProductos() {
  const { data, error } = await exigirSupabase()
    .from("productos")
    .select(CAMPOS_PRODUCTO)
    .neq("estado", "oculto")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`No fue posible cargar el catálogo: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Subcategorías creadas desde el panel. Si la consulta falla (p. ej. la tabla
 * aún no existe) el catálogo sigue funcionando, solo que sin filtros por
 * categoría: no vale la pena tumbar la tienda por eso.
 */
export async function cargarCategorias() {
  const { data, error } = await exigirSupabase()
    .from("categorias")
    .select("id, nombre, seccion, orden")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.warn("[catalogo] No se cargaron las categorías:", error.message);
    return [];
  }
  return data ?? [];
}

export function productoAgotado(producto) {
  return producto?.estado === "agotado";
}
