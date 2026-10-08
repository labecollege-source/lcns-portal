import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, CheckCircle, Sparkles } from 'lucide-react';
import { COLLEGE_AUTHENTIC_PHOTOS } from '../../data/collegeImages';
import { uploadCollegeImage } from '../../firebase/mediaService';

interface ImageUploadWidgetProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  helperText?: string;
  aspectRatio?: 'square' | 'banner' | 'card';
}

const PRESET_COLLEGE_IMAGES = COLLEGE_AUTHENTIC_PHOTOS.map((p) => ({
  name: `Photo ${p.number}: ${p.shortTitle}`,
  url: p.url,
}));

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  label,
  value,
  onChange,
  helperText = 'Upload an image from your device or paste an image URL.',
  aspectRatio = 'card',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadCollegeImage(file);
      onChange(uploaded.url);
    } catch (error) {
      console.error('Firebase Storage upload failed:', error);

      // Small-image fallback keeps the form usable when Storage has not yet been enabled.
      // It is intentionally limited because Firestore documents have a size limit.
      if (file.size <= 650 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
            alert('Firebase Storage is not available yet. A small local preview was attached. Enable Firebase Storage for public multi-device publishing.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Picture upload failed because Firebase Storage is not available. Enable Firebase Storage in the connected Firebase project and try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'w-24 h-24 sm:w-28 sm:h-28'
      : aspectRatio === 'banner'
      ? 'w-full h-36 sm:h-44'
      : 'w-36 h-28';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-slate-600 font-mono">Real-time Picture Upload</span>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        {/* Preview & Current Image */}
        {value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
            <div
              className={`${aspectClass} relative rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-slate-100 shrink-0`}
            >
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active Image Attached
              </span>
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                {value.startsWith('data:') ? 'Local uploaded picture (Base64 file)' : value}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer"
                >
                  Remove Picture
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload Drop Zone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/50'
                : 'border-slate-300 bg-white hover:border-emerald-500'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Drag & drop picture file here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-emerald-700 underline font-bold cursor-pointer hover:text-emerald-900"
              >
                browse device
              </button>
            </p>
            <p className="text-[10px] text-slate-600 mt-1">{isUploading ? "Uploading to Firebase Storage..." : "Supports PNG, JPG, JPEG, WEBP (Max 5MB)"}</p>
          </div>
        )}

        {/* Input Switch Tabs */}
        <div className="flex border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-1.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'upload'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload Device File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-1.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'url'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Web URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-1.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'presets'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            College Library
          </button>
        </div>

        {/* Tab 1: Upload from device */}
        {activeTab === 'upload' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUploading ? "Uploading to College Media..." : "Select File from Computer / Phone"}</span>
            </button>
            <span className="text-[11px] text-slate-500">{helperText}</span>
          </div>
        )}

        {/* Tab 2: URL input */}
        {activeTab === 'url' && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg or image URL..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Apply URL
            </button>
          </div>
        )}

        {/* Tab 3: Presets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_COLLEGE_IMAGES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange(preset.url)}
                className="flex items-center gap-2 p-1.5 bg-white hover:bg-emerald-50 border border-slate-200 rounded-xl transition-colors cursor-pointer text-left group"
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-emerald-900 truncate">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
