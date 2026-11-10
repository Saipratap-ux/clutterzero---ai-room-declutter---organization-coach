export type DeploymentStatus = 
  | 'queued'
  | 'installing'
  | 'building'
  | 'testing'
  | 'preview_ready'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'cancelled';

export interface FileItem {
  path: string;
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'image' | 'markdown';
}

export interface DeploymentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  commitHash?: string;
  commitMessage?: string;
  branch: string;
  status: DeploymentStatus;
  createdAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  previewUrl: string;
  isProduction: boolean;
  logs: DeploymentLog[];
  sourceType: 'zip' | 'github' | 'ai' | 'template';
  files: Record<string, string>; // path -> content
}

export interface CustomDomain {
  id: string;
  domain: string;
  verified: boolean;
  sslActive: boolean;
  dnsRecords: {
    type: 'CNAME' | 'A';
    name: string;
    value: string;
    status: 'configured' | 'pending';
  }[];
  createdAt: string;
}

export interface ProjectSettings {
  buildCommand: string;
  publishDirectory: string;
  framework: string;
  nodeVersion: string;
  autoDeployOnPush: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, string>;
  spamScore: number;
}

export interface ProjectForm {
  id: string;
  name: string;
  endpoint: string;
  enabled: boolean;
  submissionsCount: number;
  lastSubmission?: string;
}

export interface ServerlessFunction {
  id: string;
  name: string;
  route: string;
  runtime: 'Node.js 20' | 'Edge Worker';
  method: 'GET' | 'POST' | 'ALL';
  code: string;
  invocations: number;
  avgDurationMs: number;
  lastInvoked?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string; // e.g. "my-awesome-site" -> https://my-awesome-site.sai.app
  subdomain: string; // e.g. "my-awesome-site.sai.app"
  description: string;
  createdAt: string;
  updatedAt: string;
  framework: string;
  productionDeploymentId?: string;
  deployments: Deployment[];
  customDomains: CustomDomain[];
  settings: ProjectSettings;
  envVars: { key: string; value: string; isSecret: boolean }[];
  forms: ProjectForm[];
  functions: ServerlessFunction[];
  storageBytes: number;
  monthlyBandwidthBytes: number;
  visitorsToday: number;
  pageViewsToday: number;
  githubRepo?: {
    owner: string;
    name: string;
    branch: string;
    autoDeploy: boolean;
  };
  files: Record<string, string>; // active working tree files
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Owner' | 'Admin' | 'Developer';
  isLoggedIn: boolean;
  plan: 'Free Community';
  creditsRemaining: number;
  projectsLimit: number;
}

export interface Template {
  id: string;
  title: string;
  category: 'Portfolio' | 'SaaS & Tech' | 'E-Commerce' | 'Education' | 'Agency' | 'Restaurant' | 'Blog';
  description: string;
  previewUrl: string;
  framework: string;
  files: Record<string, string>;
}
