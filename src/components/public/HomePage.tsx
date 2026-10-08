import React, { useEffect, useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Bell,
  Building,
  GraduationCap,
  Phone,
  Microscope,
  Stethoscope,
  Laptop,
  Flame,
  FileCheck2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { fetchSupabaseGallery, SupabaseGalleryItem } from '../../supabase/announcements';
import { BISHOP_PROPRIETOR_IMAGE } from '../../data/collegeImages';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const {
    homepage,
    siteSettings,
    announcements,
    programmes,
    facilities,
    gallery,
    coreValues,
    news,
  } = useCollege();
  const applicationOpen = siteSettings.postUtmeApplicationOpen !== false;
  const [homepageGallery, setHomepageGallery] = useState(gallery);

  useEffect(() => {
    setHomepageGallery(gallery);

    let mounted = true;
    fetchSupabaseGallery().then((remoteGallery) => {
      if (!mounted || remoteGallery.length === 0) return;

      const normalized = remoteGallery.map((item: SupabaseGalleryItem, index) => ({
        id: item.id,
        title: item.title,
        category: item.category || 'Campus',
        imageUrl: item.image_url || item.imageUrl || '',
        caption: item.caption || item.title,
        date: item.date || '',
        displayOrder: item.display_order ?? item.displayOrder ?? index + 1,
        published: item.published !== false,
      }));

      setHomepageGallery(normalized);
    });

    return () => {
      mounted = false;
    };
  }, [gallery]);

  const featuredPhoto = homepageGallery
    .filter((photo) => photo.published !== false && photo.imageUrl)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))[0];

  // Filter active announcements
  const activeAnnouncements = announcements.filter((a) => a.active);
  const urgentAnnouncement =
    activeAnnouncements.find((a) => a.priority === 'urgent') || activeAnnouncements[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Urgent Notice Banner */}
      {urgentAnnouncement && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-emerald-950 px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <span className="bg-emerald-950 text-white px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider animate-pulse flex items-center gap-1">
                <Bell className="w-3 h-3 text-amber-300" /> NOTICE
              </span>
              <span>{urgentAnnouncement.title}:</span>
              <span className="font-medium text-emerald-950 line-clamp-1">
                {urgentAnnouncement.message}
              </span>
            </div>
            {urgentAnnouncement.linkUrl && (
              <button
                onClick={() =>
                  onNavigate(urgentAnnouncement.linkUrl?.replace('/', '') || 'admission')
                }
                className="font-bold underline text-emerald-950 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                Learn More <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Section: Institutional Emblem & Academic Presentation */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white py-14 sm:py-20 border-b border-emerald-800">
        {homepage.hero.heroImageUrl && (
          <>
            <img
              src={homepage.hero.heroImageUrl}
              alt="Labe College of Nursing Sciences campus"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Institutional Identification & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Diocese & Accreditation Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  {siteSettings.diocese}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  NMCN Accredited
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Offering ND Nursing Science Only
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <span className="text-amber-400 font-extrabold tracking-widest text-xs uppercase block">
                  Official Institution Portal
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Labe College of Nursing Science, Gboko
                </h1>
                <p className="text-amber-300 font-mono text-sm sm:text-base font-bold tracking-widest">
                  MOTTO: LEARN, SERVE AND SAVE
                </p>
              </div>

              {/* Legal & Educational Subtitle */}
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                Established by Benue State Law signed by His Excellency the Executive Governor of
                Benue State following legislative passage. We provide world-class,
                compassionate nursing training grounded in Catholic moral fortitude and clinical
                excellence.
              </p>

              {/* Assistance Notice */}
              <div className="p-3.5 bg-emerald-900/60 border border-emerald-700/80 rounded-2xl flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-300">
                  For technical assistance call @ICT 08126799565
                </span>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => applicationOpen && onNavigate('admission')}
                  disabled={!applicationOpen}
                  className={`px-6 py-3.5 ${applicationOpen ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse shadow-amber-400/40 hover:animate-none' : 'bg-slate-500'} text-emerald-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:text-white`}
                >
                  <Sparkles className="w-4 h-4" />
                  {applicationOpen ? 'Apply for 2026/2027 Post-UTME' : 'Post-UTME Application Closed'}
                </button>

                <button
                  onClick={() => onNavigate('portal')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  Student &amp; Staff Portals
                </button>

                <button
                  onClick={() => onNavigate('programmes')}
                  className="px-5 py-3.5 bg-transparent hover:bg-emerald-900/40 text-emerald-200 font-semibold text-xs uppercase tracking-wider rounded-xl border border-emerald-700 transition-colors cursor-pointer"
                >
                  Curriculum Overview
                </button>
              </div>
            </div>

            {/* Right Column: Grand Official Coat of Arms & Emblem */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-b from-emerald-900/60 to-slate-900/90 border-2 border-amber-400/70 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-md">
                <div className="flex justify-center">
                  <OfficialCrest size="2xl" light={true} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Labe College of Nursing Science
                  </h3>
                  <p className="text-xs font-bold text-amber-300 uppercase">
                    Gboko, Benue State, Nigeria
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    Catholic Diocese of Gboko • Founded on Moral &amp; Clinical Excellence
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-emerald-800 text-xs">
                  <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Status</span>
                    <span className="font-bold text-amber-300">NMCN Accredited</span>
                  </div>
                  <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Sole Programme</span>
                    <span className="font-bold text-emerald-300">ND Nursing Science</span>
                  </div>
                  <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Academic Head</span>
                    <span className="font-bold text-white text-[11px] line-clamp-1">Mrs Terna Fiase</span>
                  </div>
                  <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Support Contact</span>
                    <span className="font-bold text-amber-300 font-mono text-[11px]">08126799565</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured institutional photograph with expanded caption */}
      {featuredPhoto && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 border-4 border-amber-400 shadow-2xl">
            <img
              src={featuredPhoto.imageUrl}
              alt={featuredPhoto.title}
              className="w-full h-[420px] sm:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-12 max-w-5xl">
              <span className="inline-flex px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-4">
                {featuredPhoto.category}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
                {featuredPhoto.title}
              </h2>
              <p className="mt-3 text-sm sm:text-lg text-white leading-relaxed font-medium max-w-4xl drop-shadow-md">
                {featuredPhoto.caption}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Motto Pillars: LEARN, SERVE, SAVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xl group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 tracking-wide">
              {homepage.mottoSection.learnTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {homepage.mottoSection.learnDesc}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 tracking-wide">
              {homepage.mottoSection.serveTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {homepage.mottoSection.serveDesc}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 tracking-wide">
              {homepage.mottoSection.saveTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {homepage.mottoSection.saveDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Provost's Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-3xl overflow-hidden shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-emerald-950 flex flex-col items-center justify-center text-center">
                  {homepage.welcomeMessage.imageUrl ? (
                    <img
                      src={homepage.welcomeMessage.imageUrl}
                      alt={homepage.welcomeMessage.provostName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="p-6 space-y-4">
                      <OfficialCrest size="xl" light={true} />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                          OFFICE OF THE PROVOST
                        </span>
                        <h4 className="text-sm font-black text-white leading-tight">
                          {homepage.welcomeMessage.provostName}
                        </h4>
                        <p className="text-[10px] text-emerald-200 font-mono">
                          {homepage.welcomeMessage.provostTitle}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded-full uppercase border border-amber-400/40">
                        Chief Academic Head
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {homepage.welcomeMessage.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {homepage.welcomeMessage.provostName}
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-300 block">
                {homepage.welcomeMessage.provostTitle}
              </span>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
                {homepage.welcomeMessage.message}
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('provost')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors cursor-pointer"
                >
                  Read Full Provost Address <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  About the College
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proprietor - Bishop of Catholic Diocese of Gboko */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl overflow-hidden border border-emerald-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 bg-emerald-950 p-8 sm:p-10 flex items-center justify-center">
              <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-900">
                <img
                  src={BISHOP_PROPRIETOR_IMAGE}
                  alt="Most Rev. William A. Avenya, Bishop and Proprietor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                Proprietor - Bishop of Catholic Diocese of Gboko
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black text-emerald-950">
                Most Rev. William A. Avenya
              </h2>
              <p className="mt-1 text-sm font-bold text-emerald-700">
                Catholic Bishop of Gboko Diocese • Proprietor, Labe College of Nursing Science
              </p>
              <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
                As proprietor and pastoral guide of the College, His Lordship supports the growth
                of professional nursing education rooted in faith, discipline, compassion and
                service. Labe College of Nursing Science is called to form competent nurses who
                learn with excellence, serve with compassion and save lives with integrity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  Catholic Diocese of Gboko
                </span>
                <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  Learn • Serve • Save
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage Gallery - all published Gallery page pictures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Official Photo Archive
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              College Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              All published photographs from the College Gallery are displayed here.
            </p>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {homepageGallery
            .filter((photo) => photo.published !== false && photo.imageUrl)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onNavigate('gallery')}
                className="group relative overflow-hidden rounded-2xl bg-slate-950 aspect-[4/3] shadow-md border border-slate-200 text-left cursor-pointer"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black text-amber-300">
                    {photo.category}
                  </span>
                  <h3 className="mt-1 text-xs sm:text-sm font-black text-white leading-snug line-clamp-2">
                    {photo.title}
                  </h3>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* Sole Academic Programme Section: ND Nursing Science */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Official Academic Offering
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
              National Diploma (ND) in Nursing Science
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Note: Labe College of Nursing Science offers ND Nursing Science only.
            </p>
          </div>
          <button
            onClick={() => onNavigate('programmes')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            Curriculum Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 bg-emerald-950 text-white rounded-2xl p-6 text-center space-y-4">
            <OfficialCrest size="xl" light={true} className="justify-center mx-auto" />
            <div>
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider block">
                Programme Code: ND-NUR
              </span>
              <h3 className="text-xl font-black text-white mt-1">ND Nursing Science</h3>
              <p className="text-xs text-emerald-200 mt-1">2 Years (Full-Time National Diploma)</p>
            </div>
            <div className="inline-block bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase">
              Admission Open: 2026/2027 Session
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900">Programme Description &amp; Rigor</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A rigorous, full-time collegiate programme designed to prepare students with comprehensive
                foundations in medical sciences, clinical simulations, bedside nursing procedures, and
                patient-centered empathy in strict compliance with the Nursing and Midwifery Council of Nigeria (NMCN) standards.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Admission Requirements
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minimum of 5 O-Level credit passes in WAEC/NECO/NABTEB at not more than two sittings, including
                English Language, Mathematics, Biology, Chemistry, and Physics. Valid JAMB UTME score.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Foundations of Clinical Nursing &amp; Ethics</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Gross Anatomy, Physiology &amp; Biochemistry</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Clinical Demonstration Lab &amp; Skills Practicum</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hospital Clinical Postings &amp; OSCE Preparation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('admission')}
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Apply for Admission Now
              </button>
              <button
                onClick={() => onNavigate('programmes')}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                Full Syllabus &amp; Course Codes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Academic Infrastructure */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                Campus Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                Modern Campus &amp; Clinical Facilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Authentic on-site facilities equipped for professional nursing education and clinical competence.
              </p>
            </div>
            <button
              onClick={() => onNavigate('facilities')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              All Campus Facilities <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.filter((f) => f.active).slice(0, 6).map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {fac.imageUrl ? (
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <span className="absolute top-3 left-3 bg-emerald-950/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-emerald-700">
                      {fac.category}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 text-emerald-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase">{fac.category}</span>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Operational Facility</span>
                    </span>
                    <button
                      onClick={() => onNavigate('facilities')}
                      className="text-slate-400 group-hover:text-emerald-700 cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Photographic Archive & Historic Landmark Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-10 border-2 border-amber-400/60 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-400/40">
                Official Visual Records
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Official Campus &amp; Milestone Photo Gallery
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                Explore authentic photographs of our girls hostels, classrooms, school environment, ICT centre, and the historic signing of the college establishment law by His Excellency, Rev. Fr. Hyacinth Iormem Alia, Executive Governor of Benue State.
              </p>
              <div className="pt-1 flex flex-wrap gap-4 text-xs text-amber-300 font-semibold justify-center lg:justify-start">
                <span>✦ Girls Hostels</span>
                <span>✦ Governor Signing Law</span>
                <span>✦ Classrooms</span>
                <span>✦ School Environment</span>
                <span>✦ ICT Centre</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View Full Photo Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                Institutional Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Press & Bulletins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Press &amp; Bulletins
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Latest News &amp; Events
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            All News Releases <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-700" /> {item.publishedAt}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  By {item.author}
                </span>
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  Read Release <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <OfficialCrest size="md" light={true} className="justify-center mx-auto" />
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Begin Your Sacred Vocation in Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              Join Labe College of Nursing Science, Gboko. Learn with distinction, serve with Christ-like compassion, and save precious lives.
            </p>
            <p className="text-xs font-bold text-amber-300">
              For technical assistance call @ICT 08126799565
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate('admission')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer"
              >
                Apply for 2026/2027 Admission
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                Contact Admissions Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
