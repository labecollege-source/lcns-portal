import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Bell, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchActiveAnnouncements,
  isSupabaseConfigured,
  SupabaseAnnouncement,
} from '../../supabase/announcements';

interface AnnouncementsAdminProps {
  onNavigate: (view: string) => void;
}

export const AnnouncementsAdmin: React.FC<AnnouncementsAdminProps> = ({ onNavigate }) => {
  const { currentRole, setIsLoginModalOpen } = useCollege();
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<SupabaseAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await fetchActiveAnnouncements());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentRole === 'super_admin') load();
  }, [currentRole, load]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const clean = message.trim();
    if (!clean) return;

    setSaving(true);
    setError('');
    try {
      const created = await createAnnouncement(clean);
      setItems((current) => [created, ...current]);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;

    setError('');
    try {
      await deleteAnnouncement(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete announcement.');
    }
  };

  if (currentRole !== 'super_admin') {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
          <Bell className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-black text-emerald-950">Administrator Access Required</h1>
          <p className="text-sm text-slate-600 mt-2">
            Sign in with the LCNS Super Admin account to manage homepage announcements.
          </p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-6 px-5 py-3 rounded-xl bg-emerald-900 text-white font-bold text-sm"
          >
            Open Portal Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Super Admin / CMS
          </span>
          <h1 className="text-3xl font-black text-emerald-950 mt-1">Announcements Manager</h1>
          <p className="text-sm text-slate-600 mt-2">
            Active notices are displayed automatically in the yellow homepage ticker.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
        >
          Back to Website
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> to the Netlify environment variables, then redeploy.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
        <label htmlFor="announcement-message" className="block text-sm font-black text-slate-900 mb-2">
          New notice
        </label>
        <textarea
          id="announcement-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type the notice you want visitors to see in the ticker..."
          rows={4}
          maxLength={500}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">{message.length}/500</span>
          <button
            type="submit"
            disabled={saving || !message.trim() || !isSupabaseConfigured}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-900 text-white font-bold text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Publish Notice
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-black text-emerald-950">Active Notices</h2>
          <button onClick={load} className="text-xs font-bold text-emerald-700">Refresh</button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading announcements...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No active announcements.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 whitespace-pre-wrap">{item.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                  aria-label="Delete announcement"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
