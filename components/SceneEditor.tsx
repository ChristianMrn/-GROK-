'use client';

import React from 'react';
import { Scene } from '@/types';
import { motion } from 'framer-motion';
import { Trash2, Wand2, Video, RefreshCw } from 'lucide-react';

interface Props {
  scenes: Scene[];
  onUpdateScene: (updatedScene: Scene) => void;
  onGenerateVideo: (sceneId: string) => void;
  onDeleteScene: (id: string) => void;
}

export default function SceneEditor({ scenes, onUpdateScene, onGenerateVideo, onDeleteScene }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Scene Breakdown ({scenes.length} Scenes)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene, index) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-purple-500/15 bg-slate-900/60 p-5 backdrop-blur-md relative hover:border-purple-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Scene #{scene.sceneNumber}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{scene.duration}s</span>
                <button
                  onClick={() => onDeleteScene(scene.id)}
                  className="text-slate-500 hover:text-red-400 transition"
                  title="Delete Scene"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Narration Script</label>
                <textarea
                  value={scene.narration}
                  onChange={(e) => onUpdateScene({ ...scene, narration: e.target.value })}
                  className="w-full mt-1 p-2 text-sm bg-slate-950/80 rounded-lg border border-slate-800 text-slate-200 focus:border-purple-500 focus:outline-none resize-none h-16"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-purple-400 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> Visual Prompt (Veo Compatible)
                </label>
                <textarea
                  value={scene.imagePrompt}
                  onChange={(e) => onUpdateScene({ ...scene, imagePrompt: e.target.value })}
                  className="w-full mt-1 p-2 text-xs bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300 focus:border-purple-500 focus:outline-none resize-none h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Camera Angle:</span>
                  <span className="text-slate-300 font-medium truncate block">{scene.cameraAngle}</span>
                </div>
                <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">On-Screen Text:</span>
                  <span className="text-purple-300 font-medium truncate block">{scene.onScreenText || 'None'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800/80">
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                scene.status === 'Complete' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                scene.status === 'Generating' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse' :
                'bg-slate-800 text-slate-400'
              }`}>
                {scene.status}
              </span>

              <button
                onClick={() => onGenerateVideo(scene.id)}
                disabled={scene.status === 'Generating'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/80 hover:bg-purple-500 text-white transition disabled:opacity-50"
              >
                {scene.status === 'Generating' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Video className="w-3.5 h-3.5" />
                )}
                {scene.status === 'Complete' ? 'Regenerate Video' : 'Generate Clip'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
