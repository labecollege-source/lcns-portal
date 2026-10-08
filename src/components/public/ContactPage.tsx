import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  Search,
  ExternalLink,
} from 'lucide-react';

const SCHOOL_NAME = 'Labe College of Nursing Science, Gboko';

const SCHOOL_ADDRESS =
  'Catholic Diocese of Gboko, Off Gboko Hill Road, Gboko, PMB 1955, Gboko, Benue State, Nigeria';

const GOOGLE_SEARCH_URL =
  'https://www.google.com/search?q=Labe+College+of+Nursing+Science+Gboko+Benue+State+Nigeria';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Labe+College+of+Nursing+Science%2C+Gboko%2C+Benue+State%2C+Nigeria';

const GOOGLE_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Labe+College+of+Nursing+Science%2C+Gboko%2C+Benue+State%2C+Nigeria';

export const ContactPage: React.FC = () => {
  const { siteSettings, logAction } = useCollege();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(
    '2026/2027 Post-UTME Admission Enquiry'
  );
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    logAction(
      'Submitted Contact Form Message',
      `${name} (${email})`,
      undefined,
      subject,
      message
    );

    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="space-y-16 pb-16">

      {/* HEADER */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Get in Touch
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Contact & Enquiries
            </h1>

            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              We welcome enquiries from prospective students, parents,
              diocesan parishes, and healthcare partners.
            </p>
          </div>

          <OfficialCrest size="xl" light={true} />

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 space-y-6">

            {/* CAMPUS INFORMATION */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">

              <h2 className="text-xl font-black text-emerald-950">
                Campus Information
              </h2>

              <div className="space-y-5 text-xs sm:text-sm text-slate-700">

                {/* ADDRESS */}
                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-bold mb-1">
                      Physical Address
                    </strong>

                    <span>
                      {siteSettings.address || SCHOOL_ADDRESS}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-800 text-white text-[11px] font-bold hover:bg-emerald-900 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        View on Google Maps
                      </a>

                      <a
                        href={GOOGLE_DIRECTIONS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-emerald-950 text-[11px] font-bold hover:bg-amber-400 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Get Directions
                      </a>

                    </div>
                  </div>

                </div>

                {/* PHONE */}
                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">
                      Admission Helplines
                    </strong>

                    <p>{siteSettings.phone}</p>

                    {siteSettings.altPhone && (
                      <p>{siteSettings.altPhone}</p>
                    )}
                  </div>

                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">
                      Official Email Addresses
                    </strong>

                    <p>{siteSettings.email}</p>

                    {siteSettings.altEmail && (
                      <p>{siteSettings.altEmail}</p>
                    )}
                  </div>

                </div>

                {/* HOURS */}
                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">
                      Registry Office Hours
                    </strong>

                    <span>
                      Monday - Friday: 8:00 AM – 4:00 PM
                    </span>

                    <p className="text-[11px] text-slate-500">
                      Closed on Sundays and Catholic Solemnities
                    </p>
                  </div>

                </div>

              </div>

              {/* GOOGLE SEARCH BUTTON */}
              <div className="pt-4 border-t border-slate-200">

                <a
                  href={GOOGLE_SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search Labe College on Google
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

              </div>

            </div>

            {/* GOOGLE MAP */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

              <div className="p-6">

                <h2 className="text-xl font-black text-emerald-950">
                  Find Us on Google Maps
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Labe College of Nursing Science, Gboko, Benue State,
                  Nigeria.
                </p>

              </div>

              <div className="w-full h-[360px] bg-slate-100">

                <iframe
                  title="Labe College of Nursing Science location on Google Maps"
                  src="https://www.google.com/maps?q=Labe%20College%20of%20Nursing%20Science%2C%20Gboko%2C%20Benue%20State%2C%20Nigeria&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>

              <div className="p-5 flex flex-col sm:flex-row gap-3">

                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open Google Maps
                </a>

                <a
                  href={GOOGLE_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-emerald-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>

              </div>

            </div>

            {/* DIOCESAN NOTE */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">

              <span className="font-bold uppercase tracking-wider text-emerald-900 block">
                Catholic Diocese of Gboko
              </span>

              <p>
                Labe College of Nursing Science is a diocesan tertiary
                institution situated in Gboko, Benue State. For ecclesiastical
                matters or chaplaincy assistance, contact the College
                Chaplaincy office.
              </p>

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7">

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">

              <h2 className="text-xl font-black text-emerald-950 mb-2">
                Send an Official Message
              </h2>

              <p className="text-xs text-slate-500 mb-6">
                Fill out the form below. Enquiries are routed directly to
                the Registrar or Admissions Officer.
              </p>

              {sent ? (

                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">

                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />

                  <h3 className="font-bold text-emerald-950 text-base">
                    Message Sent Successfully!
                  </h3>

                  <p className="text-xs text-emerald-800">
                    Thank you for contacting Labe College of Nursing Science.
                    An officer will respond to your email shortly.
                  </p>

                </div>

              ) : (

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Terungwa Aondoakaa"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject
                      </label>

                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                      >
                        <option>
                          2026/2027 Post-UTME Admission Enquiry
                        </option>
                        <option>
                          Curriculum & Programme Details
                        </option>
                        <option>
                          School Fees & Bursary
                        </option>
                        <option>
                          Verification of Credentials
                        </option>
                        <option>
                          Hostel Accommodation
                        </option>
                        <option>
                          General Administration
                        </option>
                      </select>

                    </div>

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message Content *
                    </label>

                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please write your detailed enquiry here..."
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-hidden"
                    />

                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    Submit Official Enquiry
                  </button>

                </form>

              )}

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};
