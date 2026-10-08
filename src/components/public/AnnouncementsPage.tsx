import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { Bell, Calendar, ArrowRight, AlertTriangle, Info, Clock } from 'lucide-react';

interface AnnouncementsPageProps {
  onNavigate: (view: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ onNavigate }) => {
  const { announcements } = useCollege();

  const priorityStyles = {
    urgent: {
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      border: 'border-l-4 border-rose-600',
    },
    important: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      border: 'border-l-4 border-amber-500',
    },
    normal: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <Info className="w-4 h-4 text-emerald-600" />,
      border: 'border-l-4 border-emerald-600',
    },
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Official Notice Board
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Announcements & Circulars
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Timely administrative circulars, Post-UTME screening schedules, examination dates, and resumption notices.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Announcements List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {announcements.filter((a) => a.active).map((ann) => {
          const style = priorityStyles[ann.priority] || priorityStyles.normal;
          return (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl p-6 shadow-md border border-slate-200 ${style.border} space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style.badge}`}
                  >
                    {style.icon} {ann.priority} Notice
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date: {ann.date}
                  </span>
                </div>
                {ann.expiryDate && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Valid until: {ann.expiryDate}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-emerald-950">{ann.title}</h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {ann.message}
              </p>

              {ann.linkUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate(ann.linkUrl?.replace('/', '') || 'admission')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    {ann.linkText || 'Take Action'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
