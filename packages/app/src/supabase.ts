import { createClient } from '@supabase/supabase-js';
import type { UserProfileData } from './components/LoginPage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

/**
 * Save or update farmer profile in Supabase
 */
export async function syncFarmerProfile(profile: UserProfileData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { error } = await supabase
      .from('farmers')
      .upsert({
        id: profile.farmerId,
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        stage: profile.stage,
        soil: profile.soil,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync profile error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase connection error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetch a farmer's profile by ID or phone number
 */
export async function fetchFarmerProfile(identifier: string): Promise<UserProfileData | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .or(`id.eq.${identifier},phone.eq.${identifier}`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      farmerId: data.id,
      name: data.name,
      phone: data.phone || '',
      location: data.location || 'Dharwad',
      stage: data.stage || '30 days',
      soil: data.soil || 'Black Soil',
      isLoggedIn: true,
    };
  } catch (err) {
    console.warn('Failed to fetch farmer profile from Supabase:', err);
    return null;
  }
}

/**
 * Log a chat message to Supabase
 */
export async function logChatMessage(
  farmerId: string,
  sender: 'user' | 'bot',
  message: string,
  advisory?: any
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from('chat_logs').insert({
      farmer_id: farmerId,
      sender,
      message,
      advisory: advisory || null,
    });
  } catch (err) {
    // Non-blocking catch to ensure app continues working offline
    console.warn('Supabase chat logging skipped:', err);
  }
}
