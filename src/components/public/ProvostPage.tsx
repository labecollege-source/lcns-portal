import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { Quote, ArrowRight, ShieldCheck, Award } from 'lucide-react';

interface ProvostPageProps {
  onNavigate: (view: string) => void;
}

export const ProvostPage: React.FC<ProvostPageProps> = ({ onNavigate }) => {
  const { homepage, siteSettings } = useCollege();

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Office of the Provost
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Provost's Welcome Address
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              A personal message of greeting, spiritual guidance, and academic expectation from the College Chief Executive.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* Main Address */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-slate-200 pb-8">
            <div className="w-48 h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-amber-400 flex-shrink-0 bg-emerald-950 flex items-center justify-center">
              {homepage.welcomeMessage.imageUrl ? (
                <img
                  src={homepage.welcomeMessage.imageUrl}
                  alt={homepage.welcomeMessage.provostName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="p-4 text-center space-y-2">
                  <OfficialCrest size="lg" light={true} />
                  <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    Office of the Provost
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                CHIEF EXECUTIVE & ACADEMIC HEAD
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
                {homepage.welcomeMessage.provostName}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-700 uppercase">
                {homepage.welcomeMessage.provostTitle}
              </p>
              <p className="text-xs text-slate-500">
                Catholic Diocese of Gboko • Benue State, Nigeria
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
            <div className="flex items-center gap-2 text-emerald-800">
              <Quote className="w-8 h-8 text-amber-500 opacity-60" />
              <span className="font-bold text-base text-slate-900">
                "To Learn Rigorously, To Serve Selflessly, and To Save Decisively"
              </span>
            </div>

            <p>
              It is with profound joy and gratitude to God that I welcome prospective applicants, current students, parents, healthcare partners, and distinguished guests to the official portal of <strong>Labe College of Nursing Science, Gboko</strong>.
            </p>

            <p>
              Under the visionary pastoral stewardship of our proprietor and father, <strong>Most Rev. William A. Avenya</strong>, Bishop of the Catholic Diocese of Gboko, this college was instituted as a tangible answer to the urgent call for disciplined, highly competent, and deeply empathetic healthcare providers. We exist to transform healthcare across Benue State, the Middle Belt region, and the entirety of our nation Nigeria.
            </p>

            <p>
              At Labe College of Nursing Sciences, nursing is experienced not merely as an occupation, but as a noble vocation modeled after the healing ministry of Jesus Christ. Our curriculum meticulously integrates the approved benchmarks of the <strong>Nursing and Midwifery Council of Nigeria (NMCN)</strong> and the <strong>National Board for Technical Education (NBTE)</strong> with Catholic bioethics, character formation, and cutting-edge clinical simulations.
            </p>

            <div className="p-6 bg-emerald-50 rounded-2xl border-l-4 border-emerald-800 space-y-3">
              <h3 className="font-black text-emerald-950 text-sm uppercase">Our Tripartite Pledge</h3>
              <p className="text-xs text-slate-700">
                <strong>1. To Our Students:</strong> We pledge an uncompromising commitment to academic integrity, clinical mastery, world-class laboratory technology, and a secure, supportive residential campus.
              </p>
              <p className="text-xs text-slate-700">
                <strong>2. To Our Patients & Society:</strong> We pledge to graduate nurses and midwives of exceptional conscience, whose gentle hands and vigilant minds bring solace and healing to all in need.
              </p>
              <p className="text-xs text-slate-700">
                <strong>3. To God & Church:</strong> We pledge to uphold the sacred dignity of every human life from conception to natural demise, in fidelity to Gospel values.
              </p>
            </div>

            <p>
              Whether you are an aspiring candidate preparing to sit for our Post-UTME screening, or a student advancing through our rigorous clinical postings, I encourage you to pursue your studies with passion, discipline, and prayer.
            </p>

            <p className="font-semibold text-emerald-950">
              May the Holy Family of Jesus, Mary, and Joseph bless you, and may Our Lady, Health of the Sick, guide your steps.
            </p>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif italic font-bold text-lg text-emerald-900">
                  Mrs Terna Fiase Msc, Bnsc, Dip Nursing Education, RNE,RM,RN
                </p>
                <p className="text-xs text-slate-500">Provost, LCNS Gboko</p>
              </div>

              <button
                onClick={() => onNavigate('admission')}
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                Apply for Admission <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
