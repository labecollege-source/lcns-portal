import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { OfficialCrest } from '../common/OfficialCrest';
import { Calendar, User, ArrowRight, X } from 'lucide-react';
import { NewsItem } from '../../types/college';

export const NewsPage: React.FC = () => {
  const { news } = useCollege();
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const publishedNews = news.filter((n) => n.status === 'published');

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Communications & Media Bureau
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              News & Updates
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Official press releases, accreditation milestones, academic notices, and diocesan communiques.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-emerald-950 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <OfficialCrest size="md" light={true} />
                )}
                <span className="absolute top-3 left-3 bg-emerald-950 text-amber-300 text-xs font-bold uppercase px-3 py-1 rounded-md shadow">
                  {item.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" /> {item.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" /> {item.author}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    Read Full Release <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="sticky top-4 right-4 ml-auto block bg-slate-900 hover:bg-black text-white p-2 rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 w-full relative -mt-10 bg-emerald-950 flex items-center justify-center">
              {selectedArticle.imageUrl ? (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <OfficialCrest size="xl" light={true} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">{selectedArticle.title}</h2>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-3 border-b border-slate-100">
                <span>Published: {selectedArticle.publishedAt}</span>
                <span>By: {selectedArticle.author}</span>
              </div>
              <p className="font-semibold text-slate-900 text-sm">
                {selectedArticle.summary}
              </p>
              <p className="whitespace-pre-line">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
