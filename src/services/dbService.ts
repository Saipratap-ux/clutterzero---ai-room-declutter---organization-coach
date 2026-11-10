/**
 * SAIPRTAP Database Service
 * Provides persistent storage for all projects, deployments, custom domains,
 * forms, functions, and user accounts across browser reloads.
 */

import { Project, UserProfile } from '../types';
import { initialProjects, initialUser } from '../data/mockInitialData';

const STORAGE_KEYS = {
  PROJECTS: 'saiprtap_db_projects_v2',
  SELECTED_PROJECT: 'saiprtap_db_active_proj_id_v2',
  USER: 'saiprtap_db_user_v2',
};

// Safe localStorage access
function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn(`localStorage read error for ${key}:`, err);
  }
  return null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    console.warn(`localStorage write error for ${key}:`, err);
  }
}

/**
 * Loads all projects from localStorage, falling back to initial default projects.
 */
export function getStoredProjects(): Project[] {
  const raw = safeGetItem(STORAGE_KEYS.PROJECTS);
  if (!raw) {
    // Seed initial database
    saveProjects(initialProjects);
    return initialProjects;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored projects:', err);
  }
  return initialProjects;
}

/**
 * Persists the entire projects array to localStorage.
 */
export function saveProjects(projects: Project[]): void {
  safeSetItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

/**
 * Saves or updates a single project.
 */
export function saveSingleProject(updatedProject: Project): void {
  const current = getStoredProjects();
  const exists = current.some((p) => p.id === updatedProject.id);
  const updated = exists
    ? current.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    : [updatedProject, ...current];
  saveProjects(updated);
}

/**
 * Deletes a project by ID from storage.
 */
export function deleteStoredProject(projectId: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  saveProjects(updated);
  return updated;
}

/**
 * Gets the stored selected project ID.
 */
export function getStoredSelectedProjectId(): string | null {
  return safeGetItem(STORAGE_KEYS.SELECTED_PROJECT);
}

/**
 * Saves the active project ID.
 */
export function saveSelectedProjectId(id: string): void {
  safeSetItem(STORAGE_KEYS.SELECTED_PROJECT, id);
}

/**
 * Loads the user profile from storage or default.
 */
export function getStoredUser(): UserProfile {
  const raw = safeGetItem(STORAGE_KEYS.USER);
  if (!raw) {
    saveUser(initialUser);
    return initialUser;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored user profile:', err);
  }
  return initialUser;
}

/**
 * Persists the user profile to storage.
 */
export function saveUser(user: UserProfile): void {
  safeSetItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * Exports the entire database as a JSON string for backup/migration.
 */
export function exportDatabase(): string {
  const data = {
    projects: getStoredProjects(),
    user: getStoredUser(),
    exportedAt: new Date().toISOString(),
    version: '2.0',
    platform: 'SAIPRTAP Cloud',
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Imports a JSON database string.
 */
export function importDatabase(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.projects && Array.isArray(data.projects)) {
      saveProjects(data.projects);
      if (data.user) {
        saveUser(data.user);
      }
      return true;
    }
  } catch (err) {
    console.error('Failed to import database:', err);
  }
  return false;
}

/**
 * Resets database back to default initial seed data.
 */
export function resetDatabase(): { projects: Project[]; user: UserProfile } {
  saveProjects(initialProjects);
  saveUser(initialUser);
  if (initialProjects[0]) {
    saveSelectedProjectId(initialProjects[0].id);
  }
  return {
    projects: initialProjects,
    user: initialUser,
  };
}
