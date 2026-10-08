import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';

export const DownloadsPage: React.FC = () => {
  const { downloads } = useCollege();

  const handleDownload = (title: string) => {
    alert(`Downloading ${title} (Official College PDF Document)...`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Registry & Document Repository
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Official Downloads
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Download current admission brochures, prospectus, student code of conduct, and academic schedules.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Downloads Table / Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {downloads.filter((d) => d.active).map((doc) => (
            <div
              key={doc.id}
              className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-emerald-950">{doc.title}</h3>
                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                    {doc.description}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Uploaded: {doc.uploadDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc.title)}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
              >
                <Download className="w-4 h-4 text-amber-300" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
