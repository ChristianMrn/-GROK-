'use client';

import React, { useState, useEffect } from 'react';
import { Project, Scene, VideoLength, VideoStyle, VideoGenre } from '@/types';
import { getStoredProjects, saveProject, getStoredApiKeys } from '@/lib/storage';
import SettingsModal from '@/components/SettingsModal';
import SceneEditor from '@/components/SceneEditor';
import VideoTimeline from '@/components/VideoTimeline';
import YouTubeTools from '@/components/YouTubeTools';
import { Sparkles, Film, Settings, RefreshCw } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<VideoLength>('1 Minute');
  const [style, setStyle] = useState<VideoStyle>('Stylized 3D Cartoon');
  const [genre, setGenre] = useState<VideoGenre>('Educational');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'timeline' | 'youtube'>('script');

  useEffect(() => {
    const projects = getStoredProjects();
    if (projects.length > 0) {
      setCurrentProject(projects[0]);
    }
  }, []);

  const handleGenerateProject = async () => {
    if (!topic.trim()) return alert('Please enter a video topic.');
    
    const keys = getStoredApiKeys();
    if (!keys.grokApiKey) {
      setIsSettingsOpen(true);
      return alert('Please enter your Grok API key in Settings first.');
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-grok-key': keys.grokApiKey,
        },
        body: JSON.stringify({ topic, length, style, genre }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate script');

      const formattedScenes: Scene[] = data.scenes.map((s: any, idx: number) => ({
        id: `scene-${Date.now()}-${idx}`,
        sceneNumber: s.sceneNumber || idx + 1,
        narration: s.narration,
        imagePrompt: s.imagePrompt,
        veoVideoPrompt: s.imagePrompt,
        cameraAngle: s.cameraAngle || 'Dynamic Shot',
        duration: s.duration || 5,
        onScreenText: s.onScreenText || '',
        soundEffects: s.soundEffects || '',
        notes: s.notes || '',
        status: 'Waiting'
      }));

      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: data.title || topic,
        topic,
        length,
        style,
        genre,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        scenes: formattedScenes,
        seo: data.seo,
        bgMusicTrack: data.bgMusic
      };

      setCurrentProject(newProj);
      saveProject(newProj);
      setActiveTab('script');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateScene = (updatedScene: Scene) => {
    if (!currentProject) return;
    const updatedScenes = currentProject.scenes.map(s => s.id === updatedScene.id ? updatedScene : s);
    const updatedProj = { ...currentProject, scenes: updatedScenes };
    setCurrentProject(updatedProj);
    saveProject(updatedProj);
  };

  const handleGenerateVideoClip = async (sceneId: string) => {
    if (!currentProject) return;
    const keys = getStoredApiKeys();

    const scene = currentProject.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    handleUpdateScene({ ...scene, status: 'Generating' });

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-veo-key': keys.veoApiKey
        },
        body: JSON.stringify({
          prompt: scene.imagePrompt,
          style: currentProject.style,
          duration: scene.duration
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      handleUpdateScene({
        ...scene,
        status: 'Complete',
        videoUrl: data.videoUrl
      });
    } catch (err: any) {
      handleUpdateScene({ ...scene, status: 'Failed' });
      alert(`Video Generation Failed: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      <header className="sticky top-0 z-40 border-b border-purple-500/10 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-purple-200 bg-clip-text text-transparent">
              AI Video Studio
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">No-Login • Grok & Google Veo</p>
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition text-slate-300"
        >
          <Settings className="w-4 h-4 text-purple-400" />
          <span>API Settings</span>
        </button>
      </header>

      <div className="max-w-7xl w-full mx-auto p-6 space-y-8 flex-1">
        <div className="rounded-2xl border border-purple-500/20 bg-slate-900/50 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2 text-slate-100">
            <Sparkles className="w-5 h-5 text-purple-400" /> Create New AI Video Project
          </h2>
          <p className="text-xs text-slate-400 mb-6">Enter your idea. Grok generates the complete script and Veo converts it into video clips.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Video Topic</label>
              <input
                type="text"
                placeholder="e.g. What If Gravity Disappeared for 5 Seconds?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Video Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as VideoLength)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Shorts</option>
                  <option>1 Minute</option>
                  <option>3 Minutes</option>
                  <option>5 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as VideoStyle)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Stylized 3D Cartoon</option>
                  <option>Pixar</option>
                  <option>Anime</option>
                  <option>Cinematic</option>
                  <option>Realistic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as VideoGenre)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Educational</option>
                  <option>Documentary</option>
                  <option>Mystery</option>
                  <option>Storytelling</option>
                  <option>Kids</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateProject}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 font-semibold text-sm transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 text-white disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Generating Script with Grok...' : 'Generate AI Video Studio Project'}
            </button>
          </div>
        </div>

        {currentProject && (
          <div className="space-y-6">
            <div className="flex border-b border-slate-800 gap-6">
              <button
                onClick={() => setActiveTab('script')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'script' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                1. Script & Scenes
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'timeline' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                2. Video Timeline
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'youtube' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                3. YouTube SEO
              </button>
            </div>

            {activeTab === 'script' && (
              <SceneEditor
                scenes={currentProject.scenes}
                onUpdateScene={handleUpdateScene}
                onGenerateVideo={handleGenerateVideoClip}
                onDeleteScene={(id) => {
                  const scenes = currentProject.scenes.filter(s => s.id !== id);
                  const updated = { ...currentProject, scenes };
                  setCurrentProject(updated);
                  saveProject(updated);
                }}
              />
            )}

            {activeTab === 'timeline' && (
              <VideoTimeline scenes={currentProject.scenes} />
            )}

            {activeTab === 'youtube' && (
              <YouTubeTools seo={currentProject.seo} />
            )}
          </div>
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  );
}
