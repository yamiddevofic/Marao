import { exigirSupabase } from "./supabase.js";

const CAMPOS_PRODUCTO =
  "id, nombre, descripcion, precio, tipo, color, cobertura, borde, efecto, alias, presentaciones, imagen, imagenes, estado, orden";

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

export function productoAgotado(producto) {
  return producto?.estado === "agotado";
}
