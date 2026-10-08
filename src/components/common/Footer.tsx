import React from 'react';
import { OfficialCrest } from './OfficialCrest';
import { useCollege } from '../../context/CollegeContext';
import {
  MapPin,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings, setCurrentRole } = useCollege();

  return (
    <footer className="bg-emerald-950 text-slate-300 border-t-4 border-amber-500">
      {/* Motto Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 py-6 px-4 border-b border-emerald-700/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <OfficialCrest size="md" light={true} />
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                {siteSettings.diocese}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                MOTTO: {siteSettings.motto}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admission')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              2026/2027 Post-UTME Screening
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Portals Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: About & Diocese */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <OfficialCrest size="lg" light={true} showText={true} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Established under the apostolic direction of the <strong>Catholic Diocese of Gboko</strong> to deliver world-class clinical nursing education, moral discipline, and compassionate Christian healthcare to save human lives.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900 text-emerald-200 border border-emerald-800">
                <CheckCircle className="w-3 h-3 text-amber-400" /> NMCN Accredited
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900 text-emerald-200 border border-emerald-800">
                <CheckCircle className="w-3 h-3 text-amber-400" /> NBTE Approved
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900 text-emerald-200 border border-emerald-800">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Catholic Ethos
              </span>
            </div>
          </div>

          {/* Col 2: Academic Programmes */}
          {/* Col 2: Academic Programme (Sole Offering) */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Academic Programme
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('programmes')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-white"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> ND Nursing Science (Sole Programme)
                </button>
              </li>
              <li>
                <span className="text-[11px] text-emerald-300 block">
                  2 Years Full-Time National Diploma • NMCN Accredited
                </span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admission')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400 font-semibold mt-2"
                >
                  <ArrowRight className="w-3 h-3 text-amber-400" /> Post-UTME Requirements
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300">
                  About & History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('provost')} className="hover:text-amber-300">
                  Provost's Welcome
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('facilities')} className="hover:text-amber-300">
                  Simulation Labs & Campus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-amber-300">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-amber-300">
                  Latest College News
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('downloads')} className="hover:text-amber-300">
                  Academic Calendar & Downloads
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Contact */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Portals & Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{siteSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{siteSettings.email}</span>
              </div>

              {/* College Management Portal access */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('portal')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 text-xs font-bold border border-emerald-700/80 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" /> College Management Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{siteSettings.copyrightText}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Proprietor: <strong>{siteSettings.bishopName}</strong></span>
            <span>•</span>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-amber-300 transition-colors"
            >
              Contact Registry
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
