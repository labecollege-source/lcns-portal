import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import {
  Building,
  Sparkles,
  Stethoscope,
  Microscope,
  Laptop,
  BookOpen,
  HeartPulse,
  Award,
  CheckCircle2,
  ZoomIn,
  X,
  Phone,
} from 'lucide-react';
import { Facility } from '../../types/college';

interface FacilitiesPageProps {
  onNavigate: (view: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onNavigate }) => {
  const { facilities } = useCollege();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const getCategoryIcon = (category: string) => {
    if (category.includes('Demonstration') || category.includes('Clinical')) {
      return <Stethoscope className="w-6 h-6 text-emerald-800" />;
    }
    if (category.includes('Science') || category.includes('Laboratory')) {
      return <Microscope className="w-6 h-6 text-cyan-800" />;
    }
    if (category.includes('ICT')) {
      return <Laptop className="w-6 h-6 text-blue-800" />;
    }
    if (category.includes('Hostel') || category.includes('Accommodation')) {
      return <Building className="w-6 h-6 text-amber-800" />;
    }
    if (category.includes('Library') || category.includes('E-Library')) {
      return <BookOpen className="w-6 h-6 text-indigo-800" />;
    }
    if (category.includes('Sick') || category.includes('Matron')) {
      return <HeartPulse className="w-6 h-6 text-rose-800" />;
    }
    return <Building className="w-6 h-6 text-emerald-800" />;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Campus Infrastructure &amp; Clinical Suites
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Facilities &amp; Laboratories
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              State-of-the-art clinical demonstration suites, science laboratories, ICT center,
              lecture halls, and comfortable hostels at Labe College of Nursing Science, Gboko.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Facilities Grid with Authentic Photos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities
            .filter((f) => f.active)
            .map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Photo container if imageUrl is present */}
                {fac.imageUrl ? (
                  <div
                    className="relative aspect-16/10 overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setSelectedFacility(fac)}
                  >
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-emerald-950/90 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-700 backdrop-blur-xs">
                        {fac.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFacility(fac);
                      }}
                      className="absolute bottom-3 right-3 bg-white/20 hover:bg-white/40 text-white p-2 rounded-xl backdrop-blur-xs transition-opacity cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      {getCategoryIcon(fac.category)}
                    </div>
                    <span className="bg-emerald-950 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow">
                      {fac.category}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {fac.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Operational
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Gboko Campus</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedFacility && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white bg-slate-950">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full uppercase">
                {selectedFacility.category}
              </span>
              <button
                onClick={() => setSelectedFacility(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[60vh]">
              <img
                src={selectedFacility.imageUrl}
                alt={selectedFacility.title}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            <div className="p-6 bg-slate-950 text-white border-t border-slate-800 space-y-2">
              <h3 className="text-lg font-black text-amber-300">{selectedFacility.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedFacility.description}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Labe College of Nursing Sciences, Gboko
                </span>
                <span className="font-mono text-amber-400">ICT Technical Help: 08126799565</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
