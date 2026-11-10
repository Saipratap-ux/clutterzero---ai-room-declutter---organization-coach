import React, { useState } from 'react';
import { Project } from '../../types';
import { generateProjectZip } from '../../services/zipService';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Code, 
  Download, 
  Trash2, 
  Globe, 
  GitBranch, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onOpenSandbox: (project: Project) => void;
  onOpenCodeEditor: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNew: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenSandbox,
  onOpenCodeEditor,
  onDeleteProject,
  onCreateNew,
}) => {
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.framework.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    await generateProjectZip(project.name, project.files);
  };

  const handleDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${project.name}"? This will unpublish https://${project.subdomain}.`)) {
      onDeleteProject(project.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your websites, domains, atomic deployments, and source files.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by project name, slug or framework..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-base text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Try adjusting your search or create a new website with AI, ZIP upload, or templates.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white transition"
          >
            Create Your First Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const prodDep = project.deployments.find((d) => d.id === project.productionDeploymentId) || project.deployments[0];
            return (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition">
                        {project.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-0.5">{project.framework}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                      LIVE
                    </span>
                  </div>

                  <a
                    href={`https://${project.subdomain}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenSandbox(project);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 mb-3 truncate max-w-full"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">https://{project.subdomain}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
                  </a>

                  {project.customDomains.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-3">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{project.customDomains[0].domain}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {prodDep?.branch || 'main'}
                    </span>
                    <span>{project.deployments.length} deployments</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onOpenSandbox(project)}
                      className="py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center transition"
                    >
                      Open Live
                    </button>
                    <button
                      onClick={() => onOpenCodeEditor(project)}
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center transition flex items-center justify-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      <span>Code</span>
                    </button>
                    <button
                      onClick={(e) => handleDownload(project, e)}
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center transition flex items-center justify-center gap-1"
                      title="Download source ZIP"
                    >
                      <Download className="w-3 h-3" />
                      <span>ZIP</span>
                    </button>
                  </div>

                  <div className="flex justify-end mt-2 pt-2">
                    <button
                      onClick={(e) => handleDelete(project, e)}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
