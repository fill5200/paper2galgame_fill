export interface DialogueLine {
  speaker: string;
  text: string;
  emotion: 'normal' | 'happy' | 'angry' | 'surprised' | 'shy' | 'proud';
  note?: string;
}

export type BackendType = 'openai-compatible' | 'gemini';

export interface ModelConfig {
  provider: BackendType;
  apiEndpoint: string;
  modelName: string;
  apiKey: string;
}

export interface PersonaConfig {
  name: string;
  selfReference: string;
  userReference: string;
  personalityDescription: string;
  verbalTics: string[];
  toneStyle: string;
  toneDescription: string;
  visualDescription: string;
}

export interface GameSettings {
  detailLevel: 'brief' | 'detailed' | 'academic';
  personality: 'tsundere' | 'gentle' | 'strict';
}

export interface AnalysisResult {
  backend: BackendType;
  modelConfig: ModelConfig;
  fileName: string;
  title: string;
  paperText: string;
  pdfBase64?: string;
  pdfMimeType?: string;
}

export interface TeachingOutline {
  title: string;
  overview: string;
  sections: string[];
}

export interface SessionState {
  version: 2;
  backend: BackendType;
  modelConfig: ModelConfig;
  persona: PersonaConfig;
  settings: GameSettings;
  fileName: string;
  paperTitle: string;
  paperText: string;
  pdfBase64?: string;
  pdfMimeType?: string;
  outline: TeachingOutline | null;
  dialogueHistory: TeachingDialogue[];
  currentStep: number;
  teachingComplete: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TeachingDialogue {
  role: 'teacher' | 'student';
  speaker: string;
  text: string;
  emotion?: DialogueLine['emotion'];
  note?: string;
  type: 'teaching' | 'question' | 'answer' | 'outline' | 'system';
}

export interface ApiGenerateResponse {
  done: boolean;
  lines: { text: string; emotion: string; note?: string }[];
}

export interface SessionExportFile {
  version: 2;
  session: SessionState;
}

export interface OcrExportData {
  fileName: string;
  extractedAt: number;
  text: string;
  pageCount: number;
}

export enum GameState {
  IDLE,
  PROCESSING,
  PLAYING,
  PAUSED,
}
