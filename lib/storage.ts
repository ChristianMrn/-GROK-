import { ApiKeys, Project } from "@/types";

const KEYS_STORAGE_KEY = 'ai_video_studio_api_keys';
const PROJECTS_STORAGE_KEY = 'ai_video_studio_projects';

export const getStoredApiKeys = (): ApiKeys => {
  if (typeof window === 'undefined') {
    return { grokApiKey: '', veoApiKey: '', elevenLabsApiKey: '', geminiApiKey: '' };
  }
  const data = localStorage.getItem(KEYS_STORAGE_KEY);
  return data ? JSON.parse(data) : { grokApiKey: '', veoApiKey: '', elevenLabsApiKey: '', geminiApiKey: '' };
};

export const saveApiKeys = (keys: ApiKeys) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
  }
};

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PROJECTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProject = (project: Project) => {
  if (typeof window === 'undefined') return;
  const projects = getStoredProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...project, updatedAt: Date.now() };
  } else {
    projects.unshift({ ...project, updatedAt: Date.now() });
  }
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

export const deleteProject = (id: string) => {
  if (typeof window === 'undefined') return;
  const projects = getStoredProjects().filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};
