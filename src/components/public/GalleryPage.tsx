import React, { useMemo, useState } from 'react';
import { OfficialCrest } from '../common/OfficialCrest';
import { useCollege } from '../../context/CollegeContext';
import { Camera, CheckCircle2, Phone, ZoomIn, X, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../types/college';

export const GalleryPage: React.FC = () => {
  const { gallery } = useCollege();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const publishedPhotos = useMemo(
    () => gallery.filter((photo) => photo.published !== false).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [gallery]
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(publishedPhotos.map((p) => p.category))).filter(Boolean);
    return [{ id: 'all', label: `All Photos (${publishedPhotos.length})` }, ...unique.map((c) => ({ id: c, label: c }))];
  }, [publishedPhotos]);

  const filteredPhotos =
    activeCategory === 'all'
      ? publishedPhotos
      : publishedPhotos.filter((photo) => photo.category === activeCategory);

  return (
    <div className="space-y-12 pb-16">
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
              <Camera className="w-3.5 h-3.5" /> Official Institutional Photographic Records
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Official School Photo Gallery
            </h1>
            <p className="text-sm text-emerald-200 mt-2 max-w-2xl">
              Labe College of Nursing Sciences, Gboko • Catholic Diocese of Gboko. All photographs shown here are managed through the College ICT Media Center.
            </p>
          </div>
          <OfficialCrest size="xl" light={true} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">College Media Center Published Gallery</p>
              <p className="text-xs text-emerald-700">New pictures uploaded by authorized College administrators appear here automatically.</p>
            </div>
          </div>
          <a href="tel:08126799565" className="flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs">
            <Phone className="w-4 h-4 text-amber-400" /> Technical assistance: 08126799565
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredPhotos.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-700">No published pictures in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <article key={photo.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="block w-full text-left cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h2 className="font-black text-emerald-950 leading-tight">{photo.title}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">{photo.caption}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 pt-1">
                      <ZoomIn className="w-3.5 h-3.5" /> View full photograph
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">{selectedPhoto.category}</p>
                <h3 className="font-black text-slate-900">{selectedPhoto.title}</h3>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center">
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="max-h-[70vh] w-auto max-w-full object-contain" />
            </div>
            <div className="p-5 text-sm text-slate-600">{selectedPhoto.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
};
