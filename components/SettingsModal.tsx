'use client';

import React, { useState, useEffect } from 'react';
import { ApiKeys } from '@/types';
import { getStoredApiKeys, saveApiKeys } from '@/lib/storage';
import { Key, X, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [keys, setKeys] = useState<ApiKeys>({
    grokApiKey: '',
    veoApiKey: '',
    elevenLabsApiKey: '',
    geminiApiKey: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredApiKeys());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKeys(keys);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-purple-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-lg">
            <Key className="w-5 h-5" /> API Key Settings
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3 mb-5">
          Your keys are saved directly in your browser local storage.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Grok API Key (xAI)</label>
            <input
              type="password"
              placeholder="xai-..."
              value={keys.grokApiKey}
              onChange={(e) => setKeys({ ...keys, grokApiKey: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Google Veo API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keys.veoApiKey}
              onChange={(e) => setKeys({ ...keys, veoApiKey: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">ElevenLabs API Key (Optional)</label>
            <input
              type="password"
              placeholder="sk_..."
              value={keys.elevenLabsApiKey}
              onChange={(e) => setKeys({ ...keys, elevenLabsApiKey: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition shadow-lg shadow-purple-500/25"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Keys'}
          </button>
        </div>
      </div>
    </div>
  );
}
