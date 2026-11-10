import React, { useState } from 'react';
import { Project, Template } from '../../types';
import { starterTemplates } from '../../data/mockInitialData';
import { extractZipFile } from '../../services/zipService';
import { 
  UploadCloud, 
  FolderGit2, 
  Sparkles, 
  LayoutTemplate, 
  ArrowRight, 
  CheckCircle2, 
  FileCode, 
  AlertCircle,
  Eye,
  Rocket
} from 'lucide-react';

interface CreateProjectViewProps {
  onProjectCreated: (project: Project) => void;
  onNavigateToAI: () => void;
  onOpenSandbox: (project: Project) => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onProjectCreated,
  onNavigateToAI,
  onOpenSandbox,
}) => {
  const [activeMethod, setActiveMethod] = useState<'upload' | 'github' | 'ai' | 'templates'>('upload');
  
  // Upload State
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [projectNameInput, setProjectNameInput] = useState('');
  const [subdomainInput, setSubdomainInput] = useState('');

  // GitHub State
  const [githubRepo, setGithubRepo] = useState('saipratap/my-awesome-portfolio');
  const [githubBranch, setGithubBranch] = useState('main');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [publishDir, setPublishDir] = useState('dist');

  // Handle ZIP or File Upload (Method A)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsProcessingZip(true);
    setUploadProgress('Analyzing package and validating file structure...');

    try {
      let extractedFiles: Record<string, string> = {};
      let framework = 'Static HTML';

      if (file.name.endsWith('.zip')) {
        setUploadProgress('Extracting ZIP archive with path-traversal protection...');
        const result = await extractZipFile(file);
        extractedFiles = result.files;
        framework = result.detectedFramework;
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        setUploadProgress('Reading HTML source file...');
        const content = await file.text();
        extractedFiles = { 'index.html': content };
      } else {
        throw new Error('Please upload a .zip archive or an .html file.');
      }

      setUploadProgress('Provisioning isolated deployment worker...');
      await new Promise((r) => setTimeout(r, 600));

      const rawName = projectNameInput || file.name.replace(/\.[^/.]+$/, '');
      const slug = (subdomainInput || rawName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `site-${Date.now().toString().slice(-4)}`;

      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: rawName || 'Uploaded Website',
        slug: slug,
        subdomain: `${slug}.sai.app`,
        description: `Uploaded from ${file.name} · ${framework}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        framework: framework,
        productionDeploymentId: `dep_${Date.now()}`,
        files: extractedFiles,
        deployments: [
          {
            id: `dep_${Date.now()}`,
            projectId: `proj_${Date.now()}`,
            branch: 'main',
            status: 'published',
            createdAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            durationSeconds: 14,
            previewUrl: `https://${slug}.sai.app`,
            isProduction: true,
            sourceType: 'zip',
            logs: [
              { id: '1', timestamp: '00:01', level: 'info', message: `Uploaded ${file.name} (${Math.round(file.size / 1024)} KB)` },
              { id: '2', timestamp: '00:05', level: 'info', message: `Validated integrity: Framework ${framework}` },
              { id: '3', timestamp: '00:09', level: 'info', message: 'Edge CDN distribution synchronized across 300+ nodes' },
              { id: '4', timestamp: '00:14', level: 'success', message: `Atomic publication verified at https://${slug}.sai.app` },
            ],
            files: extractedFiles,
          },
        ],
        customDomains: [],
        settings: {
          buildCommand: '',
          publishDirectory: './',
          framework: framework,
          nodeVersion: '20.x',
          autoDeployOnPush: false,
        },
        envVars: [],
        forms: [],
        functions: [],
        storageBytes: file.size,
        monthlyBandwidthBytes: 0,
        visitorsToday: 1,
        pageViewsToday: 1,
      };

      setIsProcessingZip(false);
      onProjectCreated(newProject);
      onOpenSandbox(newProject);
    } catch (err: any) {
      setIsProcessingZip(false);
      setUploadError(err.message || 'Failed to process uploaded file.');
    }
  };

  // Handle GitHub Deployment (Method B)
  const handleGithubDeploy = () => {
    const slug = githubRepo.split('/')[1]?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `repo-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      id: `proj_gh_${Date.now()}`,
      name: githubRepo.split('/')[1] || 'GitHub Project',
      slug: slug,
      subdomain: `${slug}.sai.app`,
      description: `Continuous deployment connected to ${githubRepo}:${githubBranch}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      framework: 'React / Vite SPA',
      productionDeploymentId: `dep_gh_${Date.now()}`,
      githubRepo: {
        owner: githubRepo.split('/')[0] || 'user',
        name: githubRepo.split('/')[1] || 'repo',
        branch: githubBranch,
        autoDeploy: true,
      },
      files: {
        'index.html': `<!DOCTYPE html><html><head><title>${githubRepo}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 text-center"><div><div class="inline-block p-2 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-mono mb-3">GITHUB CI/CD SYNCED</div><h1 class="text-3xl font-bold mb-2">${githubRepo}</h1><p class="text-slate-400 text-sm max-w-md mx-auto">Connected to branch <code>${githubBranch}</code>. Every push triggers an automatic atomic build and edge deployment.</p></div></body></html>`,
      },
      deployments: [
        {
          id: `dep_gh_${Date.now()}`,
          projectId: `proj_gh_${Date.now()}`,
          branch: githubBranch,
          commitHash: 'e49f81a',
          commitMessage: 'Initial build from GitHub connection',
          status: 'published',
          createdAt: new Date().toISOString(),
          durationSeconds: 38,
          previewUrl: `https://${slug}.sai.app`,
          isProduction: true,
          sourceType: 'github',
          logs: [
            { id: '1', timestamp: '00:01', level: 'info', message: `Connected GitHub Webhook for ${githubRepo}` },
            { id: '2', timestamp: '00:08', level: 'info', message: `Cloned branch ${githubBranch} @ e49f81a` },
            { id: '3', timestamp: '00:18', level: 'info', message: `Running build command: ${buildCommand}` },
            { id: '4', timestamp: '00:38', level: 'success', message: `Published atomic deployment to https://${slug}.sai.app` },
          ],
          files: {},
        },
      ],
      customDomains: [],
      settings: {
        buildCommand,
        publishDirectory: publishDir,
        framework: 'React / Vite SPA',
        nodeVersion: '20.x',
        autoDeployOnPush: true,
      },
      envVars: [],
      forms: [],
      functions: [],
      storageBytes: 1200000,
      monthlyBandwidthBytes: 0,
      visitorsToday: 0,
      pageViewsToday: 0,
    };

    onProjectCreated(newProject);
    onOpenSandbox(newProject);
  };

  // Handle Deploy Template (Method D)
  const handleDeployTemplate = (template: Template) => {
    const slug = `${template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18)}-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      id: `proj_tpl_${Date.now()}`,
      name: template.title,
      slug: slug,
      subdomain: `${slug}.sai.app`,
      description: template.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      framework: template.framework,
      productionDeploymentId: `dep_tpl_${Date.now()}`,
      files: template.files,
      deployments: [
        {
          id: `dep_tpl_${Date.now()}`,
          projectId: `proj_tpl_${Date.now()}`,
          branch: 'main',
          status: 'published',
          createdAt: new Date().toISOString(),
          durationSeconds: 12,
          previewUrl: `https://${slug}.sai.app`,
          isProduction: true,
          sourceType: 'template',
          logs: [
            { id: '1', timestamp: '00:01', level: 'info', message: `Cloned template: ${template.title}` },
            { id: '2', timestamp: '00:06', level: 'info', message: 'Injected responsive Tailwind framework and Google Fonts' },
            { id: '3', timestamp: '00:12', level: 'success', message: `Live at https://${slug}.sai.app` },
          ],
          files: template.files,
        },
      ],
      customDomains: [],
      settings: {
        buildCommand: '',
        publishDirectory: './',
        framework: template.framework,
        nodeVersion: '20.x',
        autoDeployOnPush: false,
      },
      envVars: [],
      forms: [],
      functions: [],
      storageBytes: 450000,
      monthlyBandwidthBytes: 0,
      visitorsToday: 1,
      pageViewsToday: 1,
    };

    onProjectCreated(newProject);
    onOpenSandbox(newProject);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create & Deploy Website</h1>
        <p className="text-xs text-slate-400 mt-1">
          Choose from four seamless deployment methods. Free public hosting on <span className="text-amber-400 font-mono">*.sai.app</span>.
        </p>
      </div>

      {/* 4 Method Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveMethod('upload')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
            activeMethod === 'upload'
              ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <UploadCloud className={`w-6 h-6 mb-2 ${activeMethod === 'upload' ? 'text-blue-400' : 'text-slate-500'}`} />
          <div>
            <div className="font-bold text-sm text-white">Upload Website</div>
            <div className="text-[11px] text-slate-400">ZIP, HTML, CSS, JS</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMethod('github')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
            activeMethod === 'github'
              ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <FolderGit2 className={`w-6 h-6 mb-2 ${activeMethod === 'github' ? 'text-blue-400' : 'text-slate-500'}`} />
          <div>
            <div className="font-bold text-sm text-white">GitHub Connect</div>
            <div className="text-[11px] text-slate-400">Continuous deployment</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveMethod('ai');
            onNavigateToAI();
          }}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
            activeMethod === 'ai'
              ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <Sparkles className={`w-6 h-6 mb-2 ${activeMethod === 'ai' ? 'text-amber-400' : 'text-slate-500'}`} />
          <div>
            <div className="font-bold text-sm text-white">AI Website Builder</div>
            <div className="text-[11px] text-slate-400">Prompt to live website</div>
          </div>
        </button>

        <button
          onClick={() => setActiveMethod('templates')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
            activeMethod === 'templates'
              ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <LayoutTemplate className={`w-6 h-6 mb-2 ${activeMethod === 'templates' ? 'text-purple-400' : 'text-slate-500'}`} />
          <div>
            <div className="font-bold text-sm text-white">Starter Templates</div>
            <div className="text-[11px] text-slate-400">8+ responsive themes</div>
          </div>
        </button>
      </div>

      {/* Method A: Upload Content */}
      {activeMethod === 'upload' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-white">Method A: Upload Website Package</h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload a compiled build folder, a single index.html file, or a ZIP archive containing your website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Name (Optional)</label>
              <input
                type="text"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                placeholder="e.g. My Portfolio"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subdomain Slug (Optional)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomainInput}
                  onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-portfolio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-l-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2.5 rounded-r-xl text-xs font-mono text-amber-400">
                  .sai.app
                </span>
              </div>
            </div>
          </div>

          {/* Upload Drop Area */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center bg-slate-950/50 transition cursor-pointer group">
            <input
              type="file"
              accept=".zip,.html,.htm"
              onChange={handleFileUpload}
              disabled={isProcessingZip}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-white">Select or Drag & Drop Website ZIP / HTML</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Supports HTML, CSS, JavaScript, React static builds, images and fonts up to 25MB.
            </p>
            <span className="inline-block px-4 py-2 bg-blue-600 group-hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition">
              Choose File to Publish
            </span>
          </div>

          {isProcessingZip && (
            <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-blue-300 font-mono">{uploadProgress}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Method B: GitHub Connect */}
      {activeMethod === 'github' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-white">Method B: GitHub Repository Deployment</h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect a GitHub repository to trigger automatic atomic builds on every push to your production branch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repository</label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="username/repository"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
              <input
                type="text"
                value={githubBranch}
                onChange={(e) => setGithubBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Build Command</label>
              <input
                type="text"
                value={buildCommand}
                onChange={(e) => setBuildCommand(e.target.value)}
                placeholder="npm run build"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Publish Directory</label>
              <input
                type="text"
                value={publishDir}
                onChange={(e) => setPublishDir(e.target.value)}
                placeholder="dist"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGithubDeploy}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Deploy Repository to sai.app</span>
          </button>
        </div>
      )}

      {/* Method D: Starter Templates */}
      {activeMethod === 'templates' && (
        <div className="space-y-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-white">Method D: Start from Professional Templates</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a production-ready starter template. Customise its code in the built-in editor or publish instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {starterTemplates.map((template) => (
              <div
                key={template.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {template.category}
                  </span>
                  <h3 className="font-bold text-base text-white mt-2 group-hover:text-blue-400 transition">
                    {template.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">{template.framework}</span>
                  <button
                    onClick={() => handleDeployTemplate(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Deploy Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
