import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { GOVERNOR_SIGNING_IMAGE } from '../../data/collegeImages';
import {
  CheckCircle2,
  Award,
  Heart,
  ShieldCheck,
  Target,
  Compass,
  Users,
  GraduationCap,
  MapPin,
  Building,
  Palette,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { about, siteSettings, officers, coreValues } = useCollege();

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Catholic Diocese of Gboko
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              About the College
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Discover our founding legacy, Catholic Christian ethos, academic governance, and dedication to excellence in healthcare education.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* History & Diocesan Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5 text-sm text-slate-700 leading-relaxed">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full">
              Founding & Heritage
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              A Noble Calling Grounded in Faith & Science
            </h2>
            <p className="text-base text-slate-800 font-medium">
              {about.history}
            </p>

            {/* Historic Photograph: Governor Signing Law Establishing College */}
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg bg-slate-900 group">
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={GOVERNOR_SIGNING_IMAGE}
                  alt="His Excellency, the Executive Governor of Benue State, Rev. Fr. Hyacinth Iormem Alia, signing the bill establishing Labe College of Nursing Sciences, Gboko"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Official Milestone Photo
                </span>
              </div>
              <div className="p-4 bg-slate-950 text-white space-y-1">
                <p className="text-xs font-bold text-amber-300">
                  His Excellency, the Executive Governor of Benue State, Rev. Fr. Hyacinth Iormem Alia, Signing the Law Establishing Labe College of Nursing Sciences, Gboko
                </p>
                <p className="text-[11px] text-slate-300">
                  Historic milestone formalizing the establishment of the college under Catholic diocesan ownership and state statutory recognition.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong className="block text-amber-900 font-bold text-sm">Named in Honor of Late Pharmacist Ternenge Labe:</strong>
              <p>{about.namedAfter}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
              <strong className="block text-emerald-900 font-bold mb-1">Diocesan Patronage & Brainchild:</strong>
              <p>{about.founderInfo}</p>
              <p className="mt-1 text-slate-600">Location: {about.campusLocation}</p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
            <h3 className="text-base font-black text-emerald-950 uppercase tracking-wide border-b border-slate-200 pb-2">
              Key College Facts
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <OfficialCrest size="sm" />
                <div>
                  <span className="font-bold text-slate-900 block">Institution Name</span>
                  <span className="text-slate-600">{siteSettings.collegeName}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Accreditation</span>
                  <span className="text-slate-600">Nursing and Midwifery Council of Nigeria (NMCN) & NBTE</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Motto of the School</span>
                  <span className="text-red-600 font-black uppercase tracking-wider">{siteSettings.motto}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Proprietor / Patron</span>
                  <span className="text-slate-600">{siteSettings.bishopName} (Bishop of Gboko Diocese)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Official Address</span>
                  <span className="text-slate-600">{siteSettings.address}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Email: {siteSettings.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 uppercase">Vision Statement</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {about.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-amber-500 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 uppercase">Mission Statement</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {about.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School Colors and Logo Symbolism */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-600" /> Visual Identity & Heraldry
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            School Colors & Logo Symbolism
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            The logo for Labe College of Nursing Sciences, Gboko uses a combination of green, white, black, red, orange, and brown colours, telling the story of a college dedicated to producing compassionate, competent, and ethical nurses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
            <OfficialCrest size="2xl" />
            <span className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Official College Seal
            </span>
            <span className="text-xs text-red-600 font-black tracking-widest mt-1">
              "LEARN, SERVE & SAVE"
            </span>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.colorsSummary?.map((c) => (
                <div
                  key={c.color}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <strong className="text-sm font-black text-slate-900">{c.color}</strong>
                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 ml-auto">
                      {c.meaning}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.role}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium">
              <strong>In Summary:</strong> These colors together tell the story of a college dedicated to producing compassionate, competent, and ethical nurses who are committed to <em>"Learn, Serve & Save."</em>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy of the School & The School Believes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Academic & Bioethical Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            Philosophy of the School
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {about.philosophyIntro}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <h3 className="text-base font-black text-emerald-950 uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
            <Heart className="w-5 h-5 text-rose-600" /> The School Believes:
          </h3>
          <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
            {about.beliefs.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Core Values: 5 Cs + Institutional Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Moral Discipline & Best Practice
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Promoting excellence in nursing education practice and services using the five Cs of best practice nursing alongside foundational institutional pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val) => (
            <div
              key={val.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:border-emerald-600 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-black text-emerald-950 text-base">{val.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Physical Infrastructure Description */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Physical Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Campus Facilities & Setup
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Situated Off Gboko Hill Road, Gboko, PMB 1955, Gboko,
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            <p>{about.facilitiesDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="block text-emerald-950 font-bold mb-1">Administrative Block</strong>
                <span>1-storey block housing large classroom, computer lab, library, laboratories & offices.</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="block text-emerald-950 font-bold mb-1">Student Hostels & Welfare</strong>
                <span>1-storey hostels, cafeteria & kitchen, Sisters’/Matron’s 2-bedroom flat & sick bay.</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="block text-emerald-950 font-bold mb-1">St. Luke Auditorium</strong>
                <span>Over 1,000 capacity multipurpose auditorium for academic & matriculation ceremonies.</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="block text-emerald-950 font-bold mb-1">Sports & ICT Centre</strong>
                <span>ICT center, demonstration rooms, volleyball, badminton, table tennis, football & tracks.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Officers / Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Institutional Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
            College Officers & Management Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dedicated leaders directing academic, spiritual, and clinical affairs under the Catholic Diocese of Gboko.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {officers.filter((o) => o.active).map((officer) => (
            <div
              key={officer.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 flex flex-col hover:shadow-lg transition-all text-center"
            >
              <div className="h-56 relative overflow-hidden bg-emerald-950 flex items-center justify-center">
                {officer.photographUrl ? (
                  <img
                    src={officer.photographUrl}
                    alt={officer.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <OfficialCrest size="md" light={true} />
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      {officer.position}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-black text-sm sm:text-base text-emerald-950">
                    {officer.fullName}
                  </h4>
                  <span className="text-xs font-bold text-amber-700 block uppercase">
                    {officer.position}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {officer.department}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {officer.biography}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
