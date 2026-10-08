import React, { useState } from 'react';
import { OfficialCrest } from './OfficialCrest';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types/college';
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  const {
    siteSettings,
    currentRole,
    setCurrentRole,
    currentUser,
    userAccounts,
    announcements,
    setIsLoginModalOpen,
  } = useCollege();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const defaultTicker =
    'LABE COLLEGE OF NURSING SCIENCE, GBOKO • ADDRESS: Catholic Diocese of Gboko Off Gboko Hill Road, Gboko, PMB 1955, Gboko,';

  const activeTickerNotices = announcements
    .filter((notice) => notice.active)
    .filter((notice) => !notice.expiryDate || notice.expiryDate >= new Date().toISOString().split('T')[0])
    .map((notice) => notice.message)
    .filter(Boolean);

  const tickerText = activeTickerNotices.length
    ? `${defaultTicker} • ${activeTickerNotices.map((message) => `NOTICE: ${message}`).join(' • ')}`
    : defaultTicker;

  const rolesList: { role: UserRole; title: string; color: string }[] = [
    { role: 'student', title: 'Student Portal', color: 'bg-emerald-600' },
    { role: 'applicant', title: 'Applicant Portal', color: 'bg-blue-600' },
    { role: 'super_admin', title: 'Super Admin / CMS', color: 'bg-purple-700' },
    { role: 'provost', title: 'Provost Portal', color: 'bg-amber-700' },
    { role: 'registrar', title: 'Registrar Portal', color: 'bg-indigo-700' },
    { role: 'bursar', title: 'Bursar Portal', color: 'bg-teal-700' },
    { role: 'exam_officer', title: 'Exam Officer Portal', color: 'bg-cyan-700' },
    { role: 'hod_nursing', title: 'HOD Nursing Portal', color: 'bg-rose-700' },
    { role: 'admission_officer', title: 'Admission Officer', color: 'bg-sky-700' },
    { role: 'lecturer', title: 'Lecturer Portal', color: 'bg-emerald-800' },
  ];

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setPortalDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white">
      {/* Yellow address / announcement ticker */}
      <div className="bg-yellow-400 text-slate-950 overflow-hidden py-2.5 border-b-2 border-amber-600 shadow-md relative z-50">
        <div className="flex w-max animate-marquee-bold whitespace-nowrap font-black text-xs sm:text-sm tracking-wide uppercase">
          <div className="px-8" aria-label={tickerText}>{tickerText}</div>
          <div className="px-8" aria-hidden="true">{tickerText}</div>
        </div>
      </div>

      {/* Top Notification & Quick Bar */}
      <div className="bg-emerald-950 text-white text-[11px] sm:text-xs py-2 px-4 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Diocese & Motto */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 uppercase tracking-wider">
              {siteSettings.diocese}
            </span>
            <span className="hidden md:inline text-emerald-400">•</span>
            <span className="hidden md:inline font-bold tracking-widest text-emerald-200">
              MOTTO: {siteSettings.motto}
            </span>
            <span className="hidden lg:inline text-emerald-400">•</span>
            <span className="hidden lg:inline font-bold text-amber-300">
              ND NURSING SCIENCE ONLY
            </span>
          </div>

          {/* Right: Contact & Portal Switcher Bar */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            <a
              href="tel:08126799565"
              className="flex items-center gap-1.5 bg-emerald-900 px-3 py-1 rounded-full text-amber-300 hover:text-white font-bold transition-colors border border-emerald-700/60"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>For technical assistance call @ICT 08126799565</span>
            </a>
            <a
              href={`mailto:${siteSettings.email}`}
              className="hidden lg:flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{siteSettings.email}</span>
            </a>

            {/* Portal Login (For Everyone: Students, Lecturers, Staff, Admin) */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold px-3.5 py-1 rounded-full text-[11px] transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Crest */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
          >
            <OfficialCrest size="md" showText={true} />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold text-slate-700">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  activeView.startsWith('about') || activeView === 'provost' || activeView === 'facilities'
                    ? 'text-emerald-800 bg-emerald-50 font-bold'
                    : 'hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                <span>About College</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {aboutDropdownOpen && (
                <div
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                  className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <button
                    onClick={() => handleNav('about')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 block"
                  >
                    College History & Vision
                  </button>
                  <button
                    onClick={() => handleNav('provost')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 block"
                  >
                    Provost's Desk
                  </button>
                  <button
                    onClick={() => handleNav('facilities')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 block"
                  >
                    Facilities & Labs
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('programmes')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'programmes'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Programmes
            </button>

            <button
              onClick={() => handleNav('departments')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'departments'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Departments
            </button>

            <button
              onClick={() => handleNav('admission')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'admission'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Post-UTME
            </button>

            <button
              onClick={() => handleNav('gallery')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'gallery'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNav('news')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'news'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              News
            </button>

            <button
              onClick={() => handleNav('announcements')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'announcements'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Announcements
            </button>

            <button
              onClick={() => handleNav('downloads')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'downloads'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Downloads
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'contact'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Portal Login (For Everyone: Students, Lecturers, Staff, Admin) */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-300 cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-800" />
              <span>Portal Login</span>
            </button>

            {/* Apply Post-UTME button */}
            <button
              onClick={() => handleNav('admission')}
              className="relative group overflow-hidden px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-xl shadow-md hover:shadow-emerald-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Apply 2026/2027
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              onClick={() => handleNav('portal')}
              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200"
            >
              Portal
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="col-span-2 py-2.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>Portal Login (Enter ID & Password)</span>
            </button>
            <button
              onClick={() => handleNav('admission')}
              className="w-full py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl text-center shadow-sm flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Apply Post-UTME
            </button>
            <button
              onClick={() => handleNav('portal')}
              className="w-full py-2.5 bg-slate-100 text-emerald-900 text-xs font-bold rounded-xl text-center border border-slate-200 flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Management Portal
            </button>
          </div>

          <div className="space-y-1 text-sm font-semibold text-slate-800">
            <button onClick={() => handleNav('home')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Home</button>
            <button onClick={() => handleNav('about')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">About the College</button>
            <button onClick={() => handleNav('provost')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Provost's Welcome</button>
            <button onClick={() => handleNav('programmes')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Academic Programmes</button>
            <button onClick={() => handleNav('departments')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Departments</button>
            <button onClick={() => handleNav('facilities')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Facilities & Simulation Lab</button>
            <button onClick={() => handleNav('gallery')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Photo Gallery</button>
            <button onClick={() => handleNav('news')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">News & Events</button>
            <button onClick={() => handleNav('announcements')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Announcements</button>
            <button onClick={() => handleNav('downloads')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Official Downloads</button>
            <button onClick={() => handleNav('contact')} className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50">Contact College</button>
          </div>
        </div>
      )}
    </header>
  );
};
