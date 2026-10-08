export interface SupabaseAnnouncement {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export interface SupabaseGalleryItem {
  id: string;
  title: string;
  category?: string;
  image_url?: string;
  imageUrl?: string;
  caption?: string;
  date?: string;
  display_order?: number;
  displayOrder?: number;
  published?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const headers = () => ({
  apikey: SUPABASE_ANON_KEY || '',
  Authorization: `Bearer ${SUPABASE_ANON_KEY || ''}`,
  'Content-Type': 'application/json',
});

const tableUrl = (table: string) => `${SUPABASE_URL}/rest/v1/${table}`;

export async function fetchActiveAnnouncements(): Promise<SupabaseAnnouncement[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const response = await fetch(
      `${tableUrl('announcements')}?is_active=eq.true&select=id,message,is_active,created_at&order=created_at.desc`,
      { headers: headers() }
    );

    if (!response.ok) {
      // A missing table or disabled Supabase setup should never break the public site.
      return [];
    }

    return (await response.json()) as SupabaseAnnouncement[];
  } catch (error) {
    console.warn('Supabase announcements unavailable:', error);
    return [];
  }
}

export async function createAnnouncement(message: string): Promise<SupabaseAnnouncement> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const response = await fetch(tableUrl('announcements'), {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify({ message, is_active: true }),
  });

  if (!response.ok) {
    throw new Error(`Unable to create announcement (${response.status}).`);
  }

  const rows = (await response.json()) as SupabaseAnnouncement[];
  return rows[0];
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const response = await fetch(`${tableUrl('announcements')}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error(`Unable to delete announcement (${response.status}).`);
  }
}

export async function fetchSupabaseGallery(): Promise<SupabaseGalleryItem[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const response = await fetch(
      `${tableUrl('gallery')}?select=*&order=display_order.asc,created_at.desc`,
      { headers: headers() }
    );

    if (!response.ok) return [];

    const rows = (await response.json()) as SupabaseGalleryItem[];
    return rows.filter((row) => row.published !== false && Boolean(row.image_url || row.imageUrl));
  } catch (error) {
    console.warn('Supabase gallery unavailable; using local/Firebase gallery:', error);
    return [];
  }
}
