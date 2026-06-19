import React, { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { UploadScreen } from './components/UploadScreen';
import { GameScreen } from './components/GameScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { loadPersona } from './services/personaService';
import { loadModelConfig, saveModelConfig } from './config/modelConfig';
import type { SessionState, ModelConfig, PersonaConfig, GameSettings } from './types';

export enum AppState {
  TITLE,
  UPLOAD,
  GAME,
  SETTINGS,
}

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.TITLE);
  const [session, setSession] = useState<SessionState | null>(null);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(loadModelConfig);
  const [persona, setPersona] = useState<PersonaConfig>(loadPersona);
  const [settings, setSettings] = useState<GameSettings>({
    detailLevel: 'detailed',
    personality: 'tsundere',
  });

  useEffect(() => {
    if (!persona.name) {
      setPersona(loadPersona());
    }
  }, []);

  const handleStartTeaching = (newSession: SessionState) => {
    setSession(newSession);
    setCurrentState(AppState.GAME);
  };

  const handleSessionUpdate = (updated: SessionState) => {
    setSession(updated);
  };

  const handleModelConfigChange = (config: ModelConfig) => {
    setModelConfig(config);
    saveModelConfig(config);
  };

  const handlePersonaChange = (newPersona: PersonaConfig) => {
    setPersona(newPersona);
  };

  const handleBackToTitle = () => {
    setCurrentState(AppState.TITLE);
    setSession(null);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden font-serif select-none">
      <div className="absolute inset-0 z-0">
        {currentState === AppState.GAME ? (
          <img
            src="https://pic.imgdd.cc/item/693be0a2824c3b667e8d9d59.png"
            alt="Game Background"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-pink-50 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #ff9eb5 25%, transparent 25%, transparent 50%, #ff9eb5 50%, #ff9eb5 75%, transparent 75%, transparent)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute top-10 left-10 text-gal-pink-dark opacity-30 text-6xl animate-float">✿</div>
            <div className="absolute bottom-20 right-20 text-gal-pink-dark opacity-30 text-8xl animate-float" style={{ animationDelay: '1s' }}>✿</div>
            <div className="absolute top-1/2 left-1/3 text-gal-blue opacity-20 text-4xl animate-float" style={{ animationDelay: '2s' }}>✦</div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full h-full">
        {currentState === AppState.TITLE && (
          <TitleScreen
            onStart={() => setCurrentState(AppState.UPLOAD)}
            onSettings={() => setCurrentState(AppState.SETTINGS)}
          />
        )}

        {currentState === AppState.SETTINGS && (
          <SettingsScreen
            currentSettings={settings}
            onSave={(newSettings) => {
              setSettings(newSettings);
              setCurrentState(AppState.TITLE);
            }}
            onBack={() => setCurrentState(AppState.TITLE)}
            modelConfig={modelConfig}
            onModelConfigChange={handleModelConfigChange}
            persona={persona}
            onPersonaChange={handlePersonaChange}
          />
        )}

        {currentState === AppState.UPLOAD && (
          <UploadScreen
            onStartTeaching={handleStartTeaching}
            onBack={handleBackToTitle}
            modelConfig={modelConfig}
            persona={persona}
            settings={settings}
          />
        )}

        {currentState === AppState.GAME && session && (
          <GameScreen
            session={session}
            onSessionUpdate={handleSessionUpdate}
            onExit={handleBackToTitle}
          />
        )}
      </div>
    </div>
  );
};

export default App;
