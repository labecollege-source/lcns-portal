import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { CheckCircle2, Clock, BookOpen, Award, ArrowRight, Sparkles, ShieldCheck, Phone } from 'lucide-react';

interface ProgrammesPageProps {
  onNavigate: (view: string) => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({ onNavigate }) => {
  const { programmes } = useCollege();

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Academic Curricula &amp; Professional Qualifications
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Academic Programme
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Labe College of Nursing Science, Gboko offers the National Diploma (ND) in Nursing Science
              accredited by the Nursing and Midwifery Council of Nigeria (NMCN).
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs uppercase tracking-wider">
              Offering ND Nursing Science Only
            </div>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Programme Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {programmes.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* Left Insignia Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-full flex items-center justify-between">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase shadow">
                  CODE: {prog.code}
                </span>
                <span className="bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-emerald-600">
                  Admission {prog.admissionStatus.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 my-auto">
                <OfficialCrest size="2xl" light={true} className="justify-center mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">{prog.name}</h3>
                  <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                    Labe College of Nursing Science
                  </p>
                  <p className="text-[11px] text-emerald-200">Catholic Diocese of Gboko</p>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-emerald-800 text-xs text-emerald-200 flex items-center justify-around">
                <span className="flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {prog.duration}
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> NMCN Licensure
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> {prog.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> NMCN Licensure Path
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Accredited
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
                  {prog.name}
                </h2>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {prog.description}
                </p>

                {/* Entry Requirements */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-900 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-700" /> Minimum Entry Requirements:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.entryRequirements}
                  </p>
                </div>

                {/* Programme Objectives */}
                {prog.objectives && prog.objectives.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-900 mb-2">
                      Key Competencies &amp; Learning Objectives:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                      {prog.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Apply CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-600 font-medium">
                  For technical assistance call @ICT <strong>08126799565</strong>
                </span>
                <button
                  onClick={() => onNavigate('admission')}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Apply for ND Nursing Science
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
