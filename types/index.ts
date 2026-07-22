export type VideoLength = 'Shorts' | '1 Minute' | '3 Minutes' | '5 Minutes' | '10 Minutes';
export type VideoStyle = 'Stylized 3D Cartoon' | 'Pixar' | 'Anime' | 'Cinematic' | 'Realistic';
export type VideoGenre = 'Educational' | 'Documentary' | 'Mystery' | 'Storytelling' | 'Kids';
export type TTSProvider = 'ElevenLabs' | 'Gemini TTS' | 'Google TTS';

export interface Scene {
  id: string;
  sceneNumber: number;
  narration: string;
  imagePrompt: string;
  veoVideoPrompt: string;
  cameraAngle: string;
  duration: number;
  onScreenText: string;
  soundEffects: string;
  notes?: string;
  status: 'Waiting' | 'Generating' | 'Complete' | 'Failed';
  videoUrl?: string;
  audioUrl?: string;
}

export interface YouTubeSEO {
  title: string;
  description: string;
  tags: string[];
  chapters: { time: string; title: string }[];
  thumbnailTitle: string;
  thumbnailPrompt: string;
  summary: string;
  pinnedComment: string;
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  length: VideoLength;
  style: VideoStyle;
  genre: VideoGenre;
  createdAt: number;
  updatedAt: number;
  scenes: Scene[];
  seo?: YouTubeSEO;
  bgMusicTrack?: string;
}

export interface ApiKeys {
  grokApiKey: string;
  veoApiKey: string;
  elevenLabsApiKey: string;
  geminiApiKey: string;
}
