// =====================================================
// AUTH SERVICE — Login, Registro, Sesión
// =====================================================
import { supabase } from './supabase.js';

/** Registrar un usuario nuevo */
export async function register(email, password, username) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Crear perfil en tabla `profiles`
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: data.user.id, username, level: 'A1' }]);
  if (profileError) throw profileError;

  // Crear estadísticas iniciales en `user_stats`
  await supabase.from('user_stats').insert([{ profile_id: data.user.id, xp: 0, current_streak: 0 }]);

  return data.user;
}

/** Iniciar sesión */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

/** Cerrar sesión */
export async function logout() {
  await supabase.auth.signOut();
}

/** Obtener sesión activa */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_stats(*)')
    .eq('id', userId)
    .maybeSingle(); // Usamos maybeSingle para que no explote si no hay fila
    
  if (error) throw error;
  
  // Si no existe el perfil (por error de trigger o sincronización), lo creamos manual como fallback
  if (!data) {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: userId, username: 'New Student', level: 'A1' }])
      .select('*, user_stats(*)')
      .single();
    if (insertError) throw insertError;
    return newProfile;
  }
  
  return data;
}

/** Actualizar nivel del usuario */
export async function updateLevel(userId, level) {
  return supabase.from('profiles').update({ level }).eq('id', userId);
}

/** Añadir XP al usuario */
export async function addXP(userId, amount) {
  const { data } = await supabase.from('user_stats').select('xp').eq('profile_id', userId).single();
  const newXP = (data?.xp || 0) + amount;
  return supabase.from('user_stats').update({ xp: newXP, last_active: new Date() }).eq('profile_id', userId);
}

/** Actualizar racha diaria */
export async function updateStreak(userId) {
  const { data } = await supabase.from('user_stats').select('*').eq('profile_id', userId).single();
  if (!data) return;
  const last = new Date(data.last_active);
  const now = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  const newStreak = diffDays === 1 ? (data.current_streak || 0) + 1 : diffDays === 0 ? data.current_streak : 1;
  return supabase.from('user_stats').update({ current_streak: newStreak, last_active: now }).eq('profile_id', userId);
}
