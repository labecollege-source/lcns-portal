import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Database, Trash2, ShieldAlert, Power, PowerOff } from 'lucide-react';

const categories = [
  ['students','Students'],['applicants','Applicants'],['courses','Courses'],['registrations','Course Registrations'],['results','Results'],['bursar','Bursary / Payment Records'],['announcements','Announcements'],['gallery','Gallery'],['cbt','CBT Attempts'],['audits','Audit Logs']
];

export const SystemDataManager: React.FC = () => {
  const { resetPortalData, siteSettings, setPostUtmeApplicationOpen } = useCollege();
  const [selected, setSelected] = useState<string[]>([]);
  const [phrase, setPhrase] = useState('');
  const [busy, setBusy] = useState(false);
  const toggle = (id:string) => setSelected(v => v.includes(id) ? v.filter(x=>x!==id) : [...v,id]);
  const reset = async () => {
    if (!selected.length) return alert('Select at least one data category.');
    if (phrase !== 'RESET LCNS PORTAL') return alert('Type RESET LCNS PORTAL exactly to confirm.');
    if (!window.confirm('This permanently deletes the selected records. Continue?')) return;
    setBusy(true); try { await resetPortalData(selected); setSelected([]); setPhrase(''); alert('Selected portal data has been reset successfully.'); } finally { setBusy(false); }
  };
  const resetAll = async () => {
    if (phrase !== 'RESET LCNS PORTAL') return alert('Type RESET LCNS PORTAL exactly to confirm.');
    if (!window.confirm('DANGER: This clears all operational portal data. Continue?')) return;
    setBusy(true); try { await resetPortalData(['all']); setPhrase(''); alert('All operational portal data has been reset. Administrator accounts and source code were preserved.'); } finally { setBusy(false); }
  };
  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black text-emerald-950 flex items-center gap-2"><Database className="w-5 h-5"/>System Data Management</h2><p className="text-xs text-slate-500 mt-1">Delete or reset operational records before handing the portal to a company or new administrator. Source code, Firebase configuration and administrator access are preserved.</p></div><ShieldAlert className="w-8 h-8 text-rose-600"/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">{categories.map(([id,label]) => <label key={id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50"><input type="checkbox" checked={selected.includes(id)} onChange={()=>toggle(id)}/><span className="text-xs font-bold">{label}</span></label>)}</div>
      <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl"><p className="text-xs font-bold text-rose-800">Confirmation phrase</p><input value={phrase} onChange={e=>setPhrase(e.target.value)} placeholder="Type RESET LCNS PORTAL" className="mt-2 w-full p-3 rounded-xl border border-rose-200 font-mono text-sm"/><div className="flex flex-wrap gap-2 mt-3"><button disabled={busy} onClick={reset} className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50"><Trash2 className="w-4 h-4"/>Delete Selected Data</button><button disabled={busy} onClick={resetAll} className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50"><ShieldAlert className="w-4 h-4"/>Reset Entire Portal</button></div></div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md"><h2 className="text-lg font-black text-emerald-950">Post-UTME Online Application Control</h2><p className="text-xs text-slate-500 mt-1">Close applications without removing existing applicant records.</p><div className="mt-4 flex flex-wrap items-center gap-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${siteSettings.postUtmeApplicationOpen !== false ? 'bg-emerald-100 text-emerald-800':'bg-rose-100 text-rose-800'}`}>{siteSettings.postUtmeApplicationOpen !== false ? 'APPLICATION OPEN' : 'APPLICATION CLOSED'}</span><button onClick={()=>setPostUtmeApplicationOpen(!(siteSettings.postUtmeApplicationOpen !== false))} className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2">{siteSettings.postUtmeApplicationOpen !== false ? <PowerOff className="w-4 h-4"/>:<Power className="w-4 h-4"/>}{siteSettings.postUtmeApplicationOpen !== false ? 'Close Online Application':'Open Online Application'}</button></div></div>
  </div>;
};
