'use client';

import React, { useState } from 'react';
import { YouTubeSEO } from '@/types';
import { Youtube, Copy, Check } from 'lucide-react';

interface Props {
  seo?: YouTubeSEO;
}

export default function YouTubeTools({ seo }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!seo) {
    return (
      <div className="p-6 text-center text-slate-500 border border-slate-800 rounded-xl bg-slate-900/40">
        No YouTube SEO metadata generated yet. Generate a project script first!
      </div>
    );
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
        <Youtube className="w-6 h-6" /> YouTube SEO & Publishing Tools
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">SEO Title</span>
            <button onClick={() => copyToClipboard(seo.title, 'title')} className="text-slate-400 hover:text-white">
              {copiedField === 'title' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm font-medium text-slate-200">{seo.title}</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Thumbnail Title</span>
            <button onClick={() => copyToClipboard(seo.thumbnailTitle, 'thumbTitle')} className="text-slate-400 hover:text-white">
              {copiedField === 'thumbTitle' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm font-extrabold text-yellow-400 uppercase">{seo.thumbnailTitle}</p>
        </div>
      </div>

      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Description & Chapters</span>
          <button onClick={() => copyToClipboard(seo.description, 'desc')} className="text-slate-400 hover:text-white">
            {copiedField === 'desc' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{seo.description}</p>
      </div>

      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <span className="text-xs text-slate-400 font-semibold uppercase">Tags</span>
        <div className="flex flex-wrap gap-1.5">
          {seo.tags?.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-slate-800 text-purple-300 rounded border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
