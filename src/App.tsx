import React, { useState, useRef, useEffect } from 'react';
import { Project, UserProfile, Deployment, ServerlessFunction, CustomDomain } from './types';
import { initialProjects, initialUser } from './data/mockInitialData';
import { 
  getStoredProjects, 
  saveProjects, 
  getStoredSelectedProjectId, 
  saveSelectedProjectId, 
  getStoredUser, 
  saveUser 
} from './services/dbService';
import { extractZipFile } from './services/zipService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, DashboardTab } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/dashboard/OverviewView';
import { ProjectsView } from './components/dashboard/ProjectsView';
import { CreateProjectView } from './components/dashboard/CreateProjectView';
import { AIBuilderView } from './components/dashboard/AIBuilderView';
import { DeploymentsView } from './components/dashboard/DeploymentsView';
import { GitHubView } from './components/dashboard/GitHubView';
import { DomainsView } from './components/dashboard/DomainsView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { FunctionsView } from './components/dashboard/FunctionsView';
import { FormsView } from './components/dashboard/FormsView';
import { StorageView } from './components/dashboard/StorageView';
import { EnvVarsView } from './components/dashboard/EnvVarsView';
import { TeamView } from './components/dashboard/TeamView';
import { DocumentationView } from './components/dashboard/DocumentationView';
import { SettingsView } from './components/dashboard/SettingsView';
import { AdminView } from './components/dashboard/AdminView';
import { LiveSiteSandbox } from './components/sandbox/LiveSiteSandbox';
import { CodeEditorModal } from './components/dashboard/CodeEditorModal';
import { AuthModal } from './components/modals/AuthModal';

export const App: React.FC = () => {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');

  // Persistent User State
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Persistent Projects State
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const saved = getStoredSelectedProjectId();
    const stored = getStoredProjects();
    if (saved && stored.some((p) => p.id === saved)) return saved;
    return stored[0]?.id || initialProjects[0].id;
  });

  // Sync to database on state updates
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveSelectedProjectId(selectedProjectId);
  }, [selectedProjectId]);

  // Modals & Sandboxes
  const [sandboxConfig, setSandboxConfig] = useState<{
    isOpen: boolean;
    url: string;
    htmlContent: string;
    siteName: string;
  } | null>(null);

  const [codeEditorProject, setCodeEditorProject] = useState<Project | null>(null);

  // Global hidden file upload input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Helper to open sandbox for a project
  const handleOpenSandbox = (project: Project) => {
    setSandboxConfig({
      isOpen: true,
      url: `https://${project.subdomain}`,
      htmlContent: project.files['index.html'] || '<h1>Deployed on SAIPRTAP</h1>',
      siteName: project.name,
    });
  };

  const handleOpenSandboxDirect = (url: string, html: string, name: string) => {
    setSandboxConfig({
      isOpen: true,
      url,
      htmlContent: html,
      siteName: name,
    });
  };

  // Create Project handler
  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setSelectedProjectId(newProject.id);
    setCurrentView('dashboard');
    setDashboardTab('overview');
  };

  // Rollback Deployment handler (PRD Section 6 & 18)
  const handleRollback = (deploymentId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        const targetDep = proj.deployments.find((d) => d.id === deploymentId);
        if (!targetDep) return proj;

        // Create new atomic rollback deployment record
        const rollbackDep: Deployment = {
          id: `dep_rb_${Date.now()}`,
          projectId: proj.id,
          branch: targetDep.branch,
          commitHash: targetDep.commitHash,
          commitMessage: `Rollback to deployment ${targetDep.id}`,
          status: 'published',
          createdAt: new Date().toISOString(),
          durationSeconds: 3,
          previewUrl: `https://${proj.subdomain}`,
          isProduction: true,
          sourceType: targetDep.sourceType,
          logs: [
            { id: '1', timestamp: '00:01', level: 'info', message: `Initiated atomic rollback to ${targetDep.id}` },
            { id: '2', timestamp: '00:02', level: 'info', message: 'Edge router pointed to historical artifact pointer' },
            { id: '3', timestamp: '00:03', level: 'success', message: 'Rollback complete. Cache purged globally.' },
          ],
          files: targetDep.files,
        };

        return {
          ...proj,
          productionDeploymentId: rollbackDep.id,
          files: targetDep.files,
          deployments: [rollbackDep, ...proj.deployments],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Trigger New Build handler
  const handleTriggerNewBuild = () => {
    const newDep: Deployment = {
      id: `dep_rebuild_${Date.now()}`,
      projectId: activeProject.id,
      branch: 'main',
      commitHash: Math.random().toString(16).slice(2, 9),
      commitMessage: 'rebuild: manual re-deploy from console',
      status: 'published',
      createdAt: new Date().toISOString(),
      durationSeconds: 12,
      previewUrl: `https://${activeProject.subdomain}`,
      isProduction: true,
      sourceType: 'zip',
      logs: [
        { id: '1', timestamp: '00:01', level: 'info', message: 'Manual rebuild requested' },
        { id: '2', timestamp: '00:05', level: 'info', message: 'Scanning static asset tree and compressing CSS' },
        { id: '3', timestamp: '00:12', level: 'success', message: `Site re-published live at https://${activeProject.subdomain}` },
      ],
      files: activeProject.files,
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              productionDeploymentId: newDep.id,
              deployments: [newDep, ...proj.deployments],
              updatedAt: new Date().toISOString(),
            }
          : proj
      )
    );
  };

  // Update Project Slug (Subdomain)
  const handleUpdateSlug = (newSlug: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              slug: newSlug,
              subdomain: `${newSlug}.sai.app`,
              updatedAt: new Date().toISOString(),
            }
          : proj
      )
    );
  };

  // Custom Domain Add
  const handleAddCustomDomain = (domainName: string) => {
    const newDom: CustomDomain = {
      id: `dom_${Date.now()}`,
      domain: domainName,
      verified: false,
      sslActive: false,
      createdAt: new Date().toISOString(),
      dnsRecords: [
        { type: 'CNAME', name: '@', value: 'cname.sai.app', status: 'pending' },
        { type: 'A', name: '@', value: '76.76.21.21', status: 'pending' },
      ],
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? { ...proj, customDomains: [...proj.customDomains, newDom] }
          : proj
      )
    );
  };

  // Custom Domain Verify
  const handleVerifyCustomDomain = (domainId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          customDomains: proj.customDomains.map((d) =>
            d.id === domainId
              ? {
                  ...d,
                  verified: true,
                  sslActive: true,
                  dnsRecords: d.dnsRecords.map((r) => ({ ...r, status: 'configured' })),
                }
              : d
          ),
        };
      })
    );
  };

  // Custom Domain Remove
  const handleRemoveCustomDomain = (domainId: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              customDomains: proj.customDomains.filter((d) => d.id !== domainId),
            }
          : proj
      )
    );
  };

  // Serverless Function Add/Delete
  const handleAddFunction = (fn: ServerlessFunction) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, functions: [...proj.functions, fn] } : proj
      )
    );
  };

  const handleDeleteFunction = (fnId: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? { ...proj, functions: proj.functions.filter((f) => f.id !== fnId) }
          : proj
      )
    );
  };

  // Forms Add
  const handleAddForm = (name: string, endpoint: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              forms: [
                ...proj.forms,
                {
                  id: `form_${Date.now()}`,
                  name,
                  endpoint,
                  enabled: true,
                  submissionsCount: 0,
                },
              ],
            }
          : proj
      )
    );
  };

  // Environment Variables Update
  const handleUpdateEnvVars = (vars: { key: string; value: string; isSecret: boolean }[]) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, envVars: vars } : proj
      )
    );
  };

  // Code Editor Save and Deploy Handlers
  const handleSaveProjectFiles = (updatedFiles: Record<string, string>) => {
    if (!codeEditorProject) return;
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === codeEditorProject.id ? { ...proj, files: updatedFiles } : proj
      )
    );
  };

  const handleDeployFromEditor = (updatedFiles: Record<string, string>, commitMsg: string) => {
    if (!codeEditorProject) return;

    const newDep: Deployment = {
      id: `dep_edit_${Date.now()}`,
      projectId: codeEditorProject.id,
      branch: 'main',
      commitHash: Math.random().toString(16).slice(2, 9),
      commitMessage: commitMsg || 'feat: deploy code updates',
      status: 'published',
      createdAt: new Date().toISOString(),
      durationSeconds: 9,
      previewUrl: `https://${codeEditorProject.subdomain}`,
      isProduction: true,
      sourceType: 'ai',
      logs: [
        { id: '1', timestamp: '00:01', level: 'info', message: 'Received live code updates from editor' },
        { id: '2', timestamp: '00:05', level: 'info', message: 'Validated HTML/CSS document structure' },
        { id: '3', timestamp: '00:09', level: 'success', message: `Site activated at https://${codeEditorProject.subdomain}` },
      ],
      files: updatedFiles,
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === codeEditorProject.id
          ? {
              ...proj,
              files: updatedFiles,
              productionDeploymentId: newDep.id,
              deployments: [newDep, ...proj.deployments],
              updatedAt: new Date().toISOString(),
            }
          : proj
      )
    );
  };

  // Global Quick Upload trigger
  const handleGlobalUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGlobalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let extractedFiles: Record<string, string> = {};
      let framework = 'Static HTML';

      if (file.name.endsWith('.zip')) {
        const result = await extractZipFile(file);
        extractedFiles = result.files;
        framework = result.detectedFramework;
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const content = await file.text();
        extractedFiles = { 'index.html': content };
      }

      const slug = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || `site-${Date.now().toString().slice(-4)}`;

      const newProj: Project = {
        id: `proj_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        slug,
        subdomain: `${slug}.sai.app`,
        description: `Uploaded from ${file.name} · ${framework}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        framework,
        productionDeploymentId: `dep_${Date.now()}`,
        files: extractedFiles,
        deployments: [
          {
            id: `dep_${Date.now()}`,
            projectId: `proj_${Date.now()}`,
            branch: 'main',
            status: 'published',
            createdAt: new Date().toISOString(),
            durationSeconds: 11,
            previewUrl: `https://${slug}.sai.app`,
            isProduction: true,
            sourceType: 'zip',
            logs: [
              { id: '1', timestamp: '00:01', level: 'info', message: `Uploaded ${file.name}` },
              { id: '2', timestamp: '00:11', level: 'success', message: `Live at https://${slug}.sai.app` },
            ],
            files: extractedFiles,
          },
        ],
        customDomains: [],
        settings: {
          buildCommand: '',
          publishDirectory: './',
          framework,
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

      handleProjectCreated(newProj);
      handleOpenSandbox(newProj);
    } catch (err: any) {
      alert(err.message || 'Failed to upload project.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Hidden global upload input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,.html,.htm"
        onChange={handleGlobalFileSelected}
        className="hidden"
      />

      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={(view, tab) => {
          setCurrentView(view);
          if (tab) setDashboardTab(tab as DashboardTab);
        }}
        user={user}
        onOpenAuth={(m) => {
          setAuthMode(m || 'login');
          setIsAuthModalOpen(true);
        }}
        onStartBuilding={() => {
          setCurrentView('dashboard');
          setDashboardTab('create');
        }}
      />

      {/* Main View Router */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            projects={projects}
            onStartBuilding={() => {
              setCurrentView('dashboard');
              setDashboardTab('create');
            }}
            onDeployWebsite={handleGlobalUploadClick}
            onExploreAI={() => {
              setCurrentView('dashboard');
              setDashboardTab('ai-builder');
            }}
            onOpenDocs={() => {
              setCurrentView('dashboard');
              setDashboardTab('docs');
            }}
            onOpenSandbox={handleOpenSandbox}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard 16-Item Sidebar */}
          <Sidebar
            activeTab={dashboardTab}
            onSelectTab={setDashboardTab}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            user={user}
            onLogout={() => {
              setUser({ ...user, isLoggedIn: false });
              setCurrentView('landing');
            }}
            onOpenAuth={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
          />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#060a14]">
            {dashboardTab === 'overview' && (
              <OverviewView
                projects={projects}
                user={user}
                onOpenProject={(id) => {
                  setSelectedProjectId(id);
                  setDashboardTab('deployments');
                }}
                onNavigateTab={setDashboardTab}
                onOpenSandbox={handleOpenSandbox}
                onUploadZipClick={handleGlobalUploadClick}
              />
            )}

            {dashboardTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onOpenSandbox={handleOpenSandbox}
                onOpenCodeEditor={(proj) => setCodeEditorProject(proj)}
                onDeleteProject={(id) => {
                  setProjects(projects.filter((p) => p.id !== id));
                  if (selectedProjectId === id && projects.length > 1) {
                    setSelectedProjectId(projects.find((p) => p.id !== id)!.id);
                  }
                }}
                onCreateNew={() => setDashboardTab('create')}
              />
            )}

            {dashboardTab === 'create' && (
              <CreateProjectView
                onProjectCreated={handleProjectCreated}
                onNavigateToAI={() => setDashboardTab('ai-builder')}
                onOpenSandbox={handleOpenSandbox}
              />
            )}

            {dashboardTab === 'ai-builder' && (
              <AIBuilderView
                onProjectCreated={handleProjectCreated}
                onOpenSandbox={handleOpenSandbox}
                onOpenCodeEditor={(proj) => setCodeEditorProject(proj)}
              />
            )}

            {dashboardTab === 'deployments' && (
              <DeploymentsView
                project={activeProject}
                onRollback={handleRollback}
                onOpenSandbox={handleOpenSandboxDirect}
                onTriggerNewBuild={handleTriggerNewBuild}
              />
            )}

            {dashboardTab === 'github' && (
              <GitHubView
                project={activeProject}
                onTriggerWebhookDeploy={(msg) => {
                  const newDep: Deployment = {
                    id: `dep_git_${Date.now()}`,
                    projectId: activeProject.id,
                    branch: activeProject.githubRepo?.branch || 'main',
                    commitHash: Math.random().toString(16).slice(2, 9),
                    commitMessage: msg,
                    status: 'published',
                    createdAt: new Date().toISOString(),
                    durationSeconds: 15,
                    previewUrl: `https://${activeProject.subdomain}`,
                    isProduction: true,
                    sourceType: 'github',
                    logs: [
                      { id: '1', timestamp: '00:01', level: 'info', message: 'GitHub Webhook received commit event' },
                      { id: '2', timestamp: '00:07', level: 'info', message: 'Cloned branch & executed build script' },
                      { id: '3', timestamp: '00:15', level: 'success', message: `Atomic publication live on https://${activeProject.subdomain}` },
                    ],
                    files: activeProject.files,
                  };

                  setProjects((prev) =>
                    prev.map((proj) =>
                      proj.id === activeProject.id
                        ? {
                            ...proj,
                            productionDeploymentId: newDep.id,
                            deployments: [newDep, ...proj.deployments],
                            updatedAt: new Date().toISOString(),
                          }
                        : proj
                    )
                  );
                }}
              />
            )}

            {dashboardTab === 'domains' && (
              <DomainsView
                project={activeProject}
                onUpdateSlug={handleUpdateSlug}
                onAddCustomDomain={handleAddCustomDomain}
                onRemoveCustomDomain={handleRemoveCustomDomain}
                onVerifyDomain={handleVerifyCustomDomain}
              />
            )}

            {dashboardTab === 'analytics' && <AnalyticsView project={activeProject} />}

            {dashboardTab === 'functions' && (
              <FunctionsView
                project={activeProject}
                onAddFunction={handleAddFunction}
                onDeleteFunction={handleDeleteFunction}
              />
            )}

            {dashboardTab === 'forms' && (
              <FormsView project={activeProject} onAddForm={handleAddForm} />
            )}

            {dashboardTab === 'storage' && <StorageView project={activeProject} />}

            {dashboardTab === 'env-vars' && (
              <EnvVarsView project={activeProject} onUpdateEnvVars={handleUpdateEnvVars} />
            )}

            {dashboardTab === 'team' && <TeamView currentUser={user} />}

            {dashboardTab === 'docs' && <DocumentationView />}

            {dashboardTab === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={(updated) => setUser({ ...user, ...updated })}
                onDeleteAccount={() => {
                  setProjects([]);
                  setUser({ ...user, isLoggedIn: false });
                  setCurrentView('landing');
                }}
              />
            )}

            {dashboardTab === 'admin' && <AdminView projects={projects} />}

            {dashboardTab === 'templates' && (
              <CreateProjectView
                onProjectCreated={handleProjectCreated}
                onNavigateToAI={() => setDashboardTab('ai-builder')}
                onOpenSandbox={handleOpenSandbox}
              />
            )}
          </main>
        </div>
      )}

      {/* Interactive Live Sandbox Browser Modal */}
      {sandboxConfig?.isOpen && (
        <LiveSiteSandbox
          url={sandboxConfig.url}
          htmlContent={sandboxConfig.htmlContent}
          siteName={sandboxConfig.siteName}
          isModal={true}
          onClose={() => setSandboxConfig(null)}
        />
      )}

      {/* Full Integrated Code Editor & AI Diagnostic Repair Modal */}
      {codeEditorProject && (
        <CodeEditorModal
          project={codeEditorProject}
          isOpen={!!codeEditorProject}
          onClose={() => setCodeEditorProject(null)}
          onSaveFiles={handleSaveProjectFiles}
          onDeploy={handleDeployFromEditor}
        />
      )}

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
};

export default App;
