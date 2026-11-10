import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  FolderGit2, 
  GitBranch, 
  CheckCircle2, 
  RotateCw, 
  ExternalLink, 
  GitCommit, 
  ToggleRight, 
  ToggleLeft,
  Play
} from 'lucide-react';

interface GitHubViewProps {
  project: Project;
  onTriggerWebhookDeploy: (commitMsg: string) => void;
}

export const GitHubView: React.FC<GitHubViewProps> = ({
  project,
  onTriggerWebhookDeploy,
}) => {
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [isSimulatingCommit, setIsSimulatingCommit] = useState(false);
  const [commitMessage, setCommitMessage] = useState('fix: update styling and responsive containers');

  const handleSimulatePush = () => {
    setIsSimulatingCommit(true);
    setTimeout(() => {
      onTriggerWebhookDeploy(commitMessage || 'feat: automated GitHub commit deployment');
      setIsSimulatingCommit(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">GitHub Continuous Deployment</h1>
        <p className="text-xs text-slate-400 mt-1">
          Connect your Git repositories to SAIPRTAP for zero-touch automatic deployments on every commit.
        </p>
      </div>

      {/* Repository Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {project.githubRepo ? `${project.githubRepo.owner}/${project.githubRepo.name}` : `saipratap/${project.slug}`}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Production Branch: <span className="text-white font-bold">{project.githubRepo?.branch || 'main'}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://github.com/${project.githubRepo?.owner || 'saipratap'}/${project.githubRepo?.name || project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Configuration Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px]">Build Command</span>
            <div className="font-mono text-white font-bold">
              {project.settings.buildCommand || 'npm run build'}
            </div>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px]">Publish Directory</span>
            <div className="font-mono text-white font-bold">
              {project.settings.publishDirectory || './dist'}
            </div>
          </div>
        </div>

        {/* Auto Deploy Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Continuous Deployment on Push</div>
            <div className="text-[11px] text-slate-400">
              Webhook triggers immediate parallel build workers whenever code is pushed.
            </div>
          </div>
          <button
            onClick={() => setAutoDeploy(!autoDeploy)}
            className="text-xs font-mono text-emerald-400 flex items-center gap-1.5"
          >
            {autoDeploy ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ToggleRight className="w-6 h-6 inline" /> ENABLED
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <ToggleLeft className="w-6 h-6 inline" /> DISABLED
              </span>
            )}
          </button>
        </div>

        {/* Webhook Commit Simulator (PRD Section 5 Method B) */}
        <div className="p-5 rounded-2xl bg-[#060a14] border border-blue-900/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
            <GitCommit className="w-4 h-4 text-amber-400" />
            <span>Simulate GitHub Webhook Commit & Build</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Test the continuous deployment pipeline by dispatching an authentic git push event payload.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message (e.g. feat: add payment flow)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleSimulatePush}
              disabled={isSimulatingCommit}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              {isSimulatingCommit ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Pushing & Building...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Dispatch Webhook</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
