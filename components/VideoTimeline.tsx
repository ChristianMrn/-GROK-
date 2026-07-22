'use client';

import React, { useState } from 'react';
import { Scene } from '@/types';
import { Play, Pause, Scissors, Music, Mic, Layers, Download, SlidersHorizontal } from 'lucide-react';

interface Props {
  scenes: Scene[];
}

export default function VideoTimeline({ scenes }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  const activeScene = scenes[selectedSceneIndex];

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-slate-900/80 p-5 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-xl bg-black border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {activeScene?.videoUrl ? (
          <video
            src={activeScene.videoUrl}
            controls={false}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-6">
            <Layers className="w-12 h-12 text-slate-700 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-400 text-sm">Select a generated scene clip to preview on canvas</p>
          </div>
        )}

        {activeScene?.onScreenText && (
          <div className="absolute bottom-10 inset-x-0 text-center px-4">
            <span className="bg-black/80 text-yellow-300 font-extrabold text-lg px-4 py-1.5 rounded-lg backdrop-blur-sm border border-yellow-500/30 uppercase tracking-wide">
              {activeScene.onScreenText}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-b border-slate-800 py-3 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-500/20"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <span className="font-mono text-xs text-slate-400">00:00 / 01:30</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <Scissors className="w-3.5 h-3.5" /> Split
          </button>
          <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Speed
          </button>
          <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white font-medium transition shadow-md shadow-green-500/20 ml-2">
            <Download className="w-3.5 h-3.5" /> Export Video
          </button>
        </div>
      </div>

      <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="w-16 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-purple-400" /> Video
          </span>
          <div className="flex gap-1.5 flex-1 min-w-max">
            {scenes.map((scene, idx) => (
              <div
                key={scene.id}
                onClick={() => setSelectedSceneIndex(idx)}
                style={{ width: `${Math.max(scene.duration * 20, 90)}px` }}
                className={`h-16 rounded-lg p-2 border cursor-pointer transition flex flex-col justify-between truncate ${
                  selectedSceneIndex === idx
                    ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-300 truncate">Scene {scene.sceneNumber}</span>
                <span className="text-[9px] text-slate-500 font-mono">{scene.duration}s</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-16 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Mic className="w-3 h-3 text-blue-400" /> Voice
          </span>
          <div className="flex gap-1.5 flex-1 min-w-max">
            {scenes.map((scene) => (
              <div
                key={`voice-${scene.id}`}
                style={{ width: `${Math.max(scene.duration * 20, 90)}px` }}
                className="h-8 rounded bg-blue-950/30 border border-blue-500/20 px-2 flex items-center text-[10px] text-blue-300 truncate font-mono"
              >
                TTS Audio
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-16 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Music className="w-3 h-3 text-emerald-400" /> BGM
          </span>
          <div className="w-full h-8 rounded bg-emerald-950/20 border border-emerald-500/20 px-3 flex items-center text-[10px] text-emerald-300 font-mono">
            Cinematic Ambient Track.mp3
          </div>
        </div>
      </div>
    </div>
  );
}
