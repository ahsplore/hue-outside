import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Cpu, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { DailyColor, UserSettings } from '../types';
import { COLOR_PALETTE } from '../utils/colors';
import { 
  checkOllamaStatus, 
  generateScoutMission, 
  getOfflineScoutGuide 
} from '../services/ollama';
import type { 
  OllamaStatus,
  ScoutMissionOptions
} from '../services/ollama';


interface ColorScoutViewProps {
  todayColor: DailyColor;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  preselectedColor?: DailyColor;
}

export const ColorScoutView: React.FC<ColorScoutViewProps> = ({
  todayColor,
  settings,
  onUpdateSettings,
  preselectedColor
}) => {
  const [selectedColor, setSelectedColor] = useState<DailyColor>(preselectedColor || todayColor);
  const [scoutMode, setScoutMode] = useState<ScoutMissionOptions['mode']>('all_spots');
  const [difficulty, setDifficulty] = useState<'gentle' | 'curious' | 'detective'>('curious');

  // Ollama connection state
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({
    isConnected: false,
    models: [],
    checkedAt: ''
  });
  const [isCheckingOllama, setIsCheckingOllama] = useState<boolean>(false);
  const [endpointInput, setEndpointInput] = useState<string>(settings.ollamaEndpoint || 'http://localhost:11434');
  const [modelInput, setModelInput] = useState<string>(settings.ollamaModel || 'llama3.2:latest');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [missionOutput, setMissionOutput] = useState<string>('');
  const [generationSource, setGenerationSource] = useState<'ollama_live' | 'offline_guide'>('offline_guide');
  const [copied, setCopied] = useState<boolean>(false);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Ping Ollama on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsCheckingOllama(true);
    const status = await checkOllamaStatus(endpointInput);
    setOllamaStatus(status);
    setIsCheckingOllama(false);

    if (status.isConnected && status.models.length > 0 && !status.models.includes(modelInput)) {
      // Pick first available model if current not in list
      const first = status.models[0];
      setModelInput(first);
      onUpdateSettings({ ollamaModel: first });
    }
  };

  const handleSaveEndpoint = () => {
    onUpdateSettings({ ollamaEndpoint: endpointInput, ollamaModel: modelInput });
    checkConnection();
  };

  // Run AI Color Scout
  const handleGenerateScout = async () => {
    setIsGenerating(true);
    setMissionOutput('');

    // Check if Ollama is connected
    const status = await checkOllamaStatus(endpointInput);
    setOllamaStatus(status);

    if (status.isConnected) {
      setGenerationSource('ollama_live');
      try {
        await generateScoutMission({
          endpoint: endpointInput,
          model: modelInput,
          color: selectedColor,
          mode: scoutMode,
          difficulty,
          onChunk: (_chunk, fullText) => {
            setMissionOutput(fullText);
          }
        });
      } catch (err: unknown) {
        console.error('Ollama generation error:', err);
        // Fallback to offline guide if generation failed
        setGenerationSource('offline_guide');
        const fallback = getOfflineScoutGuide(selectedColor, scoutMode);
        setMissionOutput(fallback);
      }
    } else {
      // Offline fallback
      setGenerationSource('offline_guide');
      const fallback = getOfflineScoutGuide(selectedColor, scoutMode);
      setMissionOutput(fallback);
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!missionOutput) return;
    navigator.clipboard.writeText(missionOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header card */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
              <Compass className="w-4 h-4 text-[#E8A838]" />
              <span>Open-Source AI Companion</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#193826]">
              Color Scout AI
            </h1>
            <p className="text-xs sm:text-sm text-[#52796F] mt-1">
              Powered by local open-weight models via Ollama (e.g. Llama 3.2, Gemma 2, Mistral). Private, offline-capable, and completely free.
            </p>
          </div>

          {/* Connection status pill */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              ollamaStatus.isConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                ollamaStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <span>
                {ollamaStatus.isConnected
                  ? `Ollama Online (${modelInput})`
                  : 'Ollama Offline / Not Detected'}
              </span>
            </div>

            <button
              type="button"
              onClick={checkConnection}
              disabled={isCheckingOllama}
              className="p-2 rounded-xl border border-[#D8D0C2] hover:bg-[#FAF7F0] text-[#193826] text-xs transition-colors"
              title="Ping Ollama server"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingOllama ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inline Connection & Setup Accordion */}
        <div className="mt-4 pt-4 border-t border-[#E8E2D5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#52796F] font-semibold">Endpoint:</span>
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="http://localhost:11434"
                className="px-2.5 py-1 rounded-lg border border-[#D8D0C2] bg-[#FAF7F0] font-mono text-xs text-[#193826] w-48"
              />

              <span className="text-[#52796F] font-semibold">Model:</span>
              {ollamaStatus.models.length > 0 ? (
                <select
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-[#D8D0C2] bg-[#FAF7F0] font-mono text-xs text-[#193826]"
                >
                  {ollamaStatus.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder="llama3.2:latest"
                  className="px-2.5 py-1 rounded-lg border border-[#D8D0C2] bg-[#FAF7F0] font-mono text-xs text-[#193826] w-32"
                />
              )}

              <button
                type="button"
                onClick={handleSaveEndpoint}
                className="px-3 py-1 rounded-lg bg-[#193826] text-white font-bold hover:bg-[#234B34] transition-colors"
              >
                Apply
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="text-[#2D5A40] hover:text-[#193826] font-bold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{showSetupGuide ? 'Hide Ollama Setup Guide' : 'How to Run Ollama Locally'}</span>
              {showSetupGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Setup Guide Details */}
          {showSetupGuide && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3 text-xs animate-pop-in">
              <div className="flex items-center gap-2 font-bold text-[#193826]">
                <Cpu className="w-4 h-4 text-[#2D5A40]" />
                <span>Running Free Open-Weight Models Locally</span>
              </div>
              <p className="text-[#4E6759]">
                Hue Outside connects directly to <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#193826]">Ollama</a> on your computer. Your prompts never leave your local machine, and no API keys or payments are required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D5] space-y-1">
                  <span className="font-bold text-[#193826] block">Step 1: Install Ollama</span>
                  <p className="text-[#52796F]">Download for Windows, Mac, or Linux at:</p>
                  <a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-xs text-[#2D5A40] underline">
                    ollama.com/download <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8E2D5] space-y-1">
                  <span className="font-bold text-[#193826] block">Step 2: Pull a Model</span>
                  <p className="text-[#52796F]">Open terminal and run:</p>
                  <code className="block bg-[#F1EBE1] p-1.5 rounded text-[11px] font-mono text-[#193826]">
                    ollama run llama3.2
                  </code>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8E2D5] space-y-1">
                  <span className="font-bold text-[#193826] block">Step 3: Enable Browser CORS</span>
                  <p className="text-[#52796F]">Allow web app connection:</p>
                  <code className="block bg-[#F1EBE1] p-1.5 rounded text-[10px] font-mono text-[#193826]">
                    $env:OLLAMA_ORIGINS="*"<br/>ollama serve
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scout Mission Control */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs space-y-6">
        <div>
          <h2 className="font-serif-title text-xl font-bold text-[#193826] mb-1">
            Dispatch Color Scout
          </h2>
          <p className="text-xs text-[#52796F]">
            Select target color, exploration mode, and challenge level. The AI will formulate your outdoor field mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Color Picker */}
          <div>
            <label className="block text-xs font-bold text-[#193826] mb-1.5">
              Target Color
            </label>
            <div className="relative">
              <select
                value={selectedColor.id}
                onChange={(e) => {
                  const match = COLOR_PALETTE.find((c) => c.id === e.target.value);
                  if (match) setSelectedColor(match);
                }}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-xs font-bold text-[#193826] focus:outline-none"
              >
                <option value={todayColor.id}>
                  ⭐ Today's Assigned: {todayColor.name} ({todayColor.hex})
                </option>
                {COLOR_PALETTE.filter((c) => c.id !== todayColor.id).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.hex})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-[#193826] mb-1.5">
              Mission Focus
            </label>
            <select
              value={scoutMode}
              onChange={(e) => setScoutMode(e.target.value as ScoutMissionOptions['mode'])}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-xs font-bold text-[#193826] focus:outline-none"
            >
              <option value="all_spots">Full Challenge (Nature + Everyday Spots)</option>
              <option value="nature_focus">Botanical & Nature Hiding Spots</option>
              <option value="everyday_focus">Urban & Everyday Object Hunting</option>
              <option value="mindfulness">15-Minute Mindful Color Walk</option>
              <option value="creative_quest">Creative Photography Challenge</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-[#193826] mb-1.5">
              Scouting Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'gentle' | 'curious' | 'detective')}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-xs font-bold text-[#193826] focus:outline-none"
            >
              <option value="gentle">Gentle Stroll (porch, garden, nearby park)</option>
              <option value="curious">Curious Explorer (attentive looking)</option>
              <option value="detective">Botanical Detective (rare textures & flora)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            type="button"
            onClick={handleGenerateScout}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#193826] text-white hover:bg-[#234B34] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-[#F4B942] ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating 
                ? 'Color Scout is Thinking...' 
                : ollamaStatus.isConnected
                ? `Generate Mission with Ollama (${modelInput})`
                : 'Generate Scout Mission (Instant Field Guide)'}
            </span>
          </button>
        </div>

        {/* Mission Output Card */}
        {missionOutput && (
          <div className="rounded-2xl border border-[#E8E2D5] bg-[#FAF7F0] overflow-hidden animate-pop-in">
            {/* Output header */}
            <div className="p-3.5 bg-white border-b border-[#E8E2D5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="font-serif-title font-bold text-xs sm:text-sm text-[#193826]">
                  Scout Brief: {selectedColor.name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  generationSource === 'ollama_live'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {generationSource === 'ollama_live' ? `⚡ Ollama (${modelInput})` : '📘 Field Guide'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-[#52796F] hover:text-[#193826] flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Output content formatted */}
            <div className="p-5 text-xs sm:text-sm text-[#193826] leading-relaxed whitespace-pre-line font-sans">
              {missionOutput}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
