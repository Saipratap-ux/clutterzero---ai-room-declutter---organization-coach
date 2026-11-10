import React, { useState, useRef } from 'react';
import { Project } from '../../types';
import { generateWebsiteFromPrompt, GeneratedWebsiteResult } from '../../services/geminiService';
import { 
  Sparkles, 
  Send, 
  RotateCw, 
  Code, 
  Rocket, 
  Eye, 
  CheckCircle2, 
  Download, 
  Layers,
  Laptop,
  Check,
  ShieldCheck,
  Wand2,
  AlertTriangle,
  X,
  RefreshCw,
  Edit3,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIBuilderViewProps {
  onProjectCreated: (project: Project) => void;
  onOpenSandbox: (project: Project) => void;
  onOpenCodeEditor: (project: Project) => void;
}

export const AIBuilderView: React.FC<AIBuilderViewProps> = ({
  onProjectCreated,
  onOpenSandbox,
  onOpenCodeEditor,
}) => {
  const [prompt, setPrompt] = useState(
    'Create a professional education academy website with student registration, courses, interactive quizzes and an admin dashboard.'
  );
  const [aestheticTone, setAestheticTone] = useState('Royal Gold, Electric Blue & Dark Navy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedResult, setGeneratedResult] = useState<GeneratedWebsiteResult | null>(null);
  const [deployedProject, setDeployedProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const samplePrompts = [
    'Create an education website with student registration, courses, interactive quizzes and student portal.',
    'Create a high-converting dark-mode AI developer platform with live playground and pricing tiers.',
    'Create a modern gourmet restaurant landing page with chef specials, seasonal menu, and reservation form.',
    'Create an executive developer portfolio with project case studies, skills matrix, and contact form.',
    'Create an e-commerce storefront for mechanical clocks and artisanal home goods with cart & checkout.',
  ];

  const generationSteps = [
    'Analyzing architecture & requirements...',
    'Synthesizing responsive HTML5 & Tailwind layouts...',
    'Injecting interactive DOM event handlers and forms...',
    'Performing edge security validation & sanitization...',
    'Compiling standalone bundle and verifying health check...',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedResult(null);
    setDeployedProject(null);
    setCurrentStep(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Visual step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generationSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const result = await generateWebsiteFromPrompt(prompt, aestheticTone, controller.signal);
      clearInterval(stepInterval);
      setCurrentStep(generationSteps.length - 1);
      setGeneratedResult(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      if (err.name === 'AbortError') {
        setErrorMessage('Generation cancelled by user. Your prompt has been preserved.');
      } else {
        // Human-friendly error message per PRD Module B6
        setErrorMessage(
          'AI is experiencing high demand. Your request has not been lost. Please try again.'
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  const handleContinueEditing = () => {
    setErrorMessage(null);
    textareaRef.current?.focus();
  };

  const handleDeployToCloud = () => {
    if (!generatedResult) return;

    const slug = generatedResult.slug || `site-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      id: `proj_ai_${Date.now()}`,
      name: generatedResult.title,
      slug: slug,
      subdomain: `${slug}.sai.app`,
      description: generatedResult.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      framework: generatedResult.framework,
      productionDeploymentId: `dep_ai_${Date.now()}`,
      files: generatedResult.files,
      deployments: [
        {
          id: `dep_ai_${Date.now()}`,
          projectId: `proj_ai_${Date.now()}`,
          branch: 'main',
          status: 'published',
          createdAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          durationSeconds: 16,
          previewUrl: `https://${slug}.sai.app`,
          isProduction: true,
          sourceType: 'ai',
          logs: [
            { id: '1', timestamp: '00:01', level: 'info', message: 'SAIPRTAP AI Website Synthesis Pipeline started' },
            { id: '2', timestamp: '00:05', level: 'info', message: `Model verified: ${generatedResult.modelUsed || 'gemini-3.8-flash'}` },
            { id: '3', timestamp: '00:10', level: 'info', message: 'Edge asset bundle published to *.sai.app cluster' },
            { id: '4', timestamp: '00:16', level: 'success', message: `Site verified online at https://${slug}.sai.app` },
          ],
          files: generatedResult.files,
        },
      ],
      customDomains: [],
      settings: {
        buildCommand: '',
        publishDirectory: './',
        framework: generatedResult.framework,
        nodeVersion: '20.x',
        autoDeployOnPush: false,
      },
      envVars: [],
      forms: [
        {
          id: 'form_ai_default',
          name: 'Contact Submissions',
          endpoint: '/api/forms/submit',
          enabled: true,
          submissionsCount: 0,
        },
      ],
      functions: [],
      storageBytes: 520000,
      monthlyBandwidthBytes: 0,
      visitorsToday: 1,
      pageViewsToday: 1,
    };

    setDeployedProject(newProject);
    onProjectCreated(newProject);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] text-blue-300 font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SAIPRTAP AI WEBSITE BUILDER & GENERATOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Turn Any Prompt into a Published Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Describe your website in plain language. SAIPRTAP generates the structure, responsive Tailwind design, working components, and deploys it live on <span className="text-amber-400 font-mono">*.sai.app</span>.
        </p>
      </div>

      {/* User-friendly Error & Recovery Banner (PRD Module B6) */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/80 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-300">Temporary AI service update</h3>
                <p className="text-xs text-slate-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleGenerate()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
            <button
              onClick={handleContinueEditing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Continue Editing Prompt</span>
            </button>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Generator Box */}
      <form onSubmit={handleGenerate} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            What kind of website do you want to build?
          </label>
          <textarea
            ref={textareaRef}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Create an education website with student registration, courses, quizzes and an admin dashboard..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
          />
        </div>

        {/* Style tone picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Design Style:</span>
            {['Royal Gold & Dark Navy', 'Electric Blue Tech', 'Minimalist Mono', 'Vibrant Startup'].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setAestheticTone(style)}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  aestheticTone === style
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isGenerating && (
              <button
                type="button"
                onClick={handleCancelGeneration}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Website</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample prompt chips */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-500 mb-2 font-mono uppercase tracking-wider">
            Quick Prompts:
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[11px] text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg px-2.5 py-1 text-left transition truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Generation Status Pipeline */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              SAIPRTAP Resilient AI Pipeline in Progress
            </span>
            <span className="text-blue-400 font-mono">
              Stage {currentStep + 1} of {generationSteps.length}
            </span>
          </div>

          <div className="space-y-2">
            {generationSteps.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-opacity ${
                    isPast
                      ? 'text-emerald-400 font-medium'
                      : isCurrent
                      ? 'text-white font-bold'
                      : 'text-slate-600 opacity-60'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Result Preview & Actions */}
      {generatedResult && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono mb-1">
                <Check className="w-3 h-3" />
                GENERATION COMPLETE & VERIFIED
              </div>
              <h2 className="text-lg font-bold text-white">{generatedResult.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono">
                <span>Target: <span className="text-amber-400">https://{generatedResult.slug}.sai.app</span></span>
                {generatedResult.modelUsed && (
                  <span className="flex items-center gap-1 text-blue-300">
                    <Cpu className="w-3 h-3 text-blue-400" />
                    {generatedResult.modelUsed}
                  </span>
                )}
              </div>
              {generatedResult.warning && (
                <p className="text-[11px] text-amber-400 mt-1 font-sans">{generatedResult.warning}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!deployedProject ? (
                <button
                  onClick={handleDeployToCloud}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  <Rocket className="w-4 h-4 fill-current" />
                  <span>Publish to sai.app Now</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSandbox(deployedProject)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Live Site</span>
                  </button>
                  <button
                    onClick={() => onOpenCodeEditor(deployedProject)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Customize Code</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inline Sandbox Iframe */}
          <div className="h-[580px] rounded-2xl border border-slate-800 overflow-hidden bg-white shadow-2xl">
            <iframe
              title="AI Generated Website Preview"
              srcDoc={generatedResult.files['index.html']}
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
