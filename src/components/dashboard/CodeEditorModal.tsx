import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { generateProjectZip } from '../../services/zipService';
import { repairWebsiteCode } from '../../services/geminiService';
import { 
  FileCode, 
  Save, 
  Download, 
  Play, 
  Sparkles, 
  X, 
  Search, 
  FilePlus, 
  Trash2, 
  Check, 
  Eye, 
  Code,
  Layout,
  Smartphone,
  Tablet,
  Monitor,
  Undo2,
  Redo2,
  Palette,
  Type,
  ExternalLink,
  RotateCw
} from 'lucide-react';

interface CodeEditorModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSaveFiles: (files: Record<string, string>) => void;
  onDeploy: (files: Record<string, string>, commitMessage: string) => void;
}

type EditorMode = 'code' | 'visual';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const CodeEditorModal: React.FC<CodeEditorModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveFiles,
  onDeploy,
}) => {
  // Mode & Device Switchers (PRD Section 4.5)
  const [editorMode, setEditorMode] = useState<EditorMode>('code');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Files & Active File
  const [files, setFiles] = useState<Record<string, string>>({ ...project.files });
  const [activeFilePath, setActiveFilePath] = useState<string>(
    Object.keys(project.files)[0] || 'index.html'
  );
  const [currentContent, setCurrentContent] = useState<string>(
    files[activeFilePath] || ''
  );

  // Undo / Redo history stack
  const [history, setHistory] = useState<string[]>([files[activeFilePath] || '']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Search & AI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFixingWithAI, setIsFixingWithAI] = useState(false);
  const [aiFixMessage, setAiFixMessage] = useState('');
  const [aiFixPrompt, setAiFixPrompt] = useState('');
  const [showAIPromptInput, setShowAIPromptInput] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [commitMessage, setCommitMessage] = useState('update: site code edits');

  // Visual Editor parsed values (extracted from index.html)
  const [visualTitle, setVisualTitle] = useState('');
  const [visualHeadline, setVisualHeadline] = useState('');
  const [visualSubtitle, setVisualSubtitle] = useState('');
  const [visualCtaText, setVisualCtaText] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb'); // blue-600
  const [badgeText, setBadgeText] = useState('LIVE ON SAI.APP');

  // Synchronize active project when modal opens
  useEffect(() => {
    if (isOpen) {
      setFiles({ ...project.files });
      const initialPath = Object.keys(project.files)[0] || 'index.html';
      setActiveFilePath(initialPath);
      const content = project.files[initialPath] || '';
      setCurrentContent(content);
      setHistory([content]);
      setHistoryIndex(0);

      // Parse initial visual values from index.html
      const html = project.files['index.html'] || '';
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch) setVisualTitle(titleMatch[1]);

      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match) {
        // Strip inner tags for display
        setVisualHeadline(h1Match[1].replace(/<[^>]+>/g, '').trim());
      }

      const pMatch = html.match(/<p[^>]*class="[^"]*lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i) ||
                     html.match(/<main[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
      if (pMatch) {
        setVisualSubtitle(pMatch[1].replace(/<[^>]+>/g, '').trim());
      }

      const btnMatch = html.match(/<(?:a|button)[^>]*class="[^"]*(?:btn|bg-blue|bg-indigo)[^"]*"[^>]*>([\s\S]*?)<\/(?:a|button)>/i);
      if (btnMatch) {
        setVisualCtaText(btnMatch[1].replace(/<[^>]+>/g, '').trim());
      }
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const fileList = Object.keys(files).filter((path) =>
    path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Push new history state
  const updateContentWithHistory = (newContent: string) => {
    setCurrentContent(newContent);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newContent);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setCurrentContent(history[prev]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCurrentContent(history[next]);
    }
  };

  const handleSelectFile = (path: string) => {
    // Save current active file buffer first
    const updated = { ...files, [activeFilePath]: currentContent };
    setFiles(updated);
    setActiveFilePath(path);
    const nextContent = updated[path] || '';
    setCurrentContent(nextContent);
    setHistory([nextContent]);
    setHistoryIndex(0);
  };

  const handleCreateFile = () => {
    const filename = prompt('Enter new filename (e.g. style.css, script.js, about.html):');
    if (!filename) return;
    const cleanName = filename.trim().replace(/^\//, '');
    if (files[cleanName]) {
      alert('A file with this name already exists.');
      return;
    }
    const initialContent = cleanName.endsWith('.css')
      ? '/* Custom Styles for SAIPRTAP */\nbody { box-sizing: border-box; }\n'
      : cleanName.endsWith('.js')
      ? '// Custom Scripts for SAIPRTAP\nconsole.log("Loaded custom script");\n'
      : '<!DOCTYPE html>\n<html>\n<head><title>New Page</title></head>\n<body><h1>New Page</h1></body>\n</html>';

    const updated = { ...files, [cleanName]: initialContent };
    setFiles(updated);
    setActiveFilePath(cleanName);
    setCurrentContent(initialContent);
    setHistory([initialContent]);
    setHistoryIndex(0);
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (path === 'index.html') {
      alert('Cannot delete index.html (required root entry point).');
      return;
    }
    if (!confirm(`Delete ${path}?`)) return;
    const updated = { ...files };
    delete updated[path];
    setFiles(updated);
    const remaining = Object.keys(updated);
    if (remaining.length > 0) {
      setActiveFilePath(remaining[0]);
      setCurrentContent(updated[remaining[0]]);
    }
  };

  // Apply visual editor edits to index.html
  const applyVisualEditsToHTML = () => {
    let html = files['index.html'] || currentContent;

    if (visualTitle) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${visualTitle}</title>`);
    }

    if (visualHeadline) {
      html = html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${visualHeadline}</h1>`);
    }

    if (visualSubtitle) {
      html = html.replace(
        /(<main[\s\S]*?<p[^>]*>)([\s\S]*?)(<\/p>)/i,
        `$1${visualSubtitle}$3`
      );
    }

    if (visualCtaText) {
      html = html.replace(
        /(<(?:a|button)[^>]*class="[^"]*(?:btn|bg-blue|bg-indigo)[^"]*"[^>]*>)([\s\S]*?)(<\/(?:a|button)>)/i,
        `$1${visualCtaText}$3`
      );
    }

    // Update in files
    const updated = { ...files, 'index.html': html };
    setFiles(updated);
    if (activeFilePath === 'index.html') {
      updateContentWithHistory(html);
    }
    onSaveFiles(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveOnly = () => {
    const updatedFiles = { ...files, [activeFilePath]: currentContent };
    setFiles(updatedFiles);
    onSaveFiles(updatedFiles);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveAndDeploy = () => {
    const updatedFiles = { ...files, [activeFilePath]: currentContent };
    setFiles(updatedFiles);
    onDeploy(updatedFiles, commitMessage || 'feat: deploy code updates');
    onClose();
  };

  const handleAIFix = async () => {
    setIsFixingWithAI(true);
    setAiFixMessage('Analyzing HTML markup, responsiveness, and styles with Gemini AI...');
    try {
      const instructions = aiFixPrompt.trim() ||
        'Fix markup syntax, improve mobile responsiveness, ensure proper Tailwind setup, fix broken styling, and enhance accessibility.';
      const fixed = await repairWebsiteCode(currentContent, instructions);
      updateContentWithHistory(fixed);
      setFiles((prev) => ({ ...prev, [activeFilePath]: fixed }));
      setAiFixMessage('AI Code repair completed successfully!');
      setShowAIPromptInput(false);
      setTimeout(() => setAiFixMessage(''), 3500);
    } catch {
      setAiFixMessage('Diagnostic repair encountered an issue. Please try again.');
    } finally {
      setIsFixingWithAI(false);
    }
  };

  const handleDownloadZip = async () => {
    const updatedFiles = { ...files, [activeFilePath]: currentContent };
    await generateProjectZip(project.name, updatedFiles);
  };

  // Preview dimensions according to device mode
  const getDeviceFrameStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          maxHeight: '100%',
          borderRadius: '24px',
          border: '8px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        };
      case 'tablet':
        return {
          width: '768px',
          height: '100%',
          maxHeight: '100%',
          borderRadius: '16px',
          border: '6px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          border: 'none',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-4">
      <div className="w-full h-full max-w-[1600px] bg-[#090d18] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Master Toolbar */}
        <div className="bg-[#0e1526] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Left: Project Brand & Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{project.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {project.slug}.sai.app
                </span>
              </div>
            </div>

            {/* Mode Switcher: Visual Editor vs Code Editor */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 ml-2">
              <button
                onClick={() => setEditorMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  editorMode === 'code'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code Editor</span>
              </button>
              <button
                onClick={() => setEditorMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  editorMode === 'visual'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Visual Editor</span>
              </button>
            </div>
          </div>

          {/* Center: Device Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === 'desktop' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === 'tablet' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === 'mobile' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {editorMode === 'code' && (
              <>
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowAIPromptInput(!showAIPromptInput)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
                  title="Run AI Diagnostics & Auto-Repair"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Fix & Polish</span>
                </button>
              </>
            )}

            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              title="Download Source Code ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ZIP</span>
            </button>

            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                showLivePreview
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={editorMode === 'visual' ? applyVisualEditsToHTML : handleSaveOnly}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save</span>
            </button>

            <button
              onClick={handleSaveAndDeploy}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Publish Live</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Custom Instruction Prompt Bar (if toggled) */}
        {showAIPromptInput && (
          <div className="bg-amber-950/60 border-b border-amber-800/80 px-4 py-2.5 flex flex-col sm:flex-row items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={aiFixPrompt}
              onChange={(e) => setAiFixPrompt(e.target.value)}
              placeholder="Tell AI what to fix: e.g. Fix mobile nav menu, center hero text, make colors darker..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAIFix}
                disabled={isFixingWithAI}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                {isFixingWithAI ? (
                  <>
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Repairing...</span>
                  </>
                ) : (
                  <span>Apply AI Repair</span>
                )}
              </button>
              <button
                onClick={() => setShowAIPromptInput(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status notification */}
        {aiFixMessage && (
          <div className="bg-blue-950/80 border-b border-blue-800 px-4 py-1.5 text-xs text-blue-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {aiFixMessage}
            </span>
            <button onClick={() => setAiFixMessage('')} className="text-blue-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: File Explorer (Code Mode) OR Visual Controls (Visual Mode) */}
          {editorMode === 'code' ? (
            <div className="w-56 bg-[#070b14] border-r border-slate-800 flex flex-col shrink-0 select-none">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Explorer</span>
                <button
                  onClick={handleCreateFile}
                  className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800 transition"
                  title="Create New File"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* File search */}
              <div className="p-2 border-b border-slate-800/80">
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find file..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {fileList.map((path) => {
                  const isActive = activeFilePath === path;
                  return (
                    <div
                      key={path}
                      onClick={() => handleSelectFile(path)}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{path}</span>
                      </div>
                      {path !== 'index.html' && (
                        <button
                          onClick={(e) => handleDeleteFile(path, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition"
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                <div>Framework: {project.framework}</div>
                <div>Root: /index.html</div>
              </div>
            </div>
          ) : (
            /* Visual Editor Sidebar Controls */
            <div className="w-80 bg-[#070b14] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-4 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                  Visual Customizer
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Live Content & Branding</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update text and colors. Changes reflect immediately in the live preview.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Page Title */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Page Title & Tab Label</label>
                  <input
                    type="text"
                    value={visualTitle}
                    onChange={(e) => setVisualTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Hero Headline */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hero Main Heading (H1)</label>
                  <textarea
                    rows={2}
                    value={visualHeadline}
                    onChange={(e) => setVisualHeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Hero Subtitle */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hero Description / Subtitle</label>
                  <textarea
                    rows={3}
                    value={visualSubtitle}
                    onChange={(e) => setVisualSubtitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Primary Button Text */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Call To Action Button Label</label>
                  <input
                    type="text"
                    value={visualCtaText}
                    onChange={(e) => setVisualCtaText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Color Scheme Quick Options */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Theme Palette</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Royal Gold & Navy', color: '#f59e0b', bg: '#080d1a' },
                      { name: 'Electric Blue', color: '#2563eb', bg: '#030712' },
                      { name: 'Emerald Forest', color: '#10b981', bg: '#022c22' },
                      { name: 'Cyber Purple', color: '#a855f7', bg: '#090514' },
                    ].map((pal) => (
                      <button
                        key={pal.name}
                        onClick={() => {
                          setPrimaryColor(pal.color);
                          applyVisualEditsToHTML();
                        }}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex items-center gap-2 transition"
                      >
                        <div
                          className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: pal.color }}
                        />
                        <span className="text-[11px] text-slate-300 truncate">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={applyVisualEditsToHTML}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply & Sync to HTML</span>
                </button>
              </div>
            </div>
          )}

          {/* Central Code Area (Code Mode only) */}
          {editorMode === 'code' && (
            <div className="flex-1 flex flex-col bg-[#050811] overflow-hidden">
              {/* Tab header */}
              <div className="bg-[#0a0f1d] border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  {activeFilePath}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {currentContent.length} chars · {currentContent.split('\n').length} lines
                </span>
              </div>

              <textarea
                value={currentContent}
                onChange={(e) => updateContentWithHistory(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-[#050811] text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none selection:bg-blue-600/40 leading-relaxed border-0 overflow-auto"
              />
            </div>
          )}

          {/* Live Preview Panel (Always shown or split) */}
          {showLivePreview && (
            <div
              className={`bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden ${
                editorMode === 'visual' ? 'flex-1' : 'w-[520px] lg:w-[600px] xl:w-[700px]'
              }`}
            >
              <div className="bg-[#0a0f1d] border-b border-slate-800 px-3 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview: https://{project.subdomain}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="capitalize">{deviceMode}</span>
                  <span>·</span>
                  <span className="text-emerald-400">Live Reload</span>
                </div>
              </div>

              {/* Viewport Canvas with Device Frame */}
              <div className="flex-1 bg-[#0b0f19] p-4 flex items-center justify-center overflow-auto">
                <div
                  style={getDeviceFrameStyles()}
                  className="bg-white overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <iframe
                    title="Live Split Preview"
                    srcDoc={
                      activeFilePath === 'index.html'
                        ? currentContent
                        : files['index.html'] || currentContent
                    }
                    sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                    className="w-full h-full border-0 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
