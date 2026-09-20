import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "./supabase-config.js";

const CONFIGURACION_INCOMPLETA =
  SUPABASE_URL.includes("TU-PROYECTO") ||
  SUPABASE_PUBLISHABLE_KEY.includes("TU_CLAVE_PUBLICA");

if (!window.supabase?.createClient) {
  throw new Error("La librería de Supabase no está cargada.");
}

export const supabase = CONFIGURACION_INCOMPLETA
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export function exigirSupabase() {
  if (!supabase) {
    throw new Error(
      "Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en js/supabase-config.js.",
    );
  }
  return supabase;
}
