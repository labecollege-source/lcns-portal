import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { Building2, User, Mail, BookOpen, ArrowRight } from 'lucide-react';

interface DepartmentsPageProps {
  onNavigate: (view: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onNavigate }) => {
  const { departments } = useCollege();

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Faculty & Academic Units
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Academic Departments
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Specialized departments driving instructional excellence, clinical simulation, and hospital rotations.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.filter((d) => d.active).map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    CODE: {dept.code}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold">Active Unit</span>
                </div>

                <h3 className="text-xl font-black text-emerald-950">{dept.name}</h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dept.description}
                </p>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Head of Dept: <strong className="text-slate-900">{dept.hodName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    <span>{dept.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('programmes')}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  View Department Courses
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
