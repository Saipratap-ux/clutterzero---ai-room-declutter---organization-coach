import JSZip from 'jszip';

export interface ExtractedProject {
  files: Record<string, string>;
  detectedFramework: string;
  entryHtml?: string;
  totalSize: number;
}

/**
 * Safely extracts uploaded ZIP archive with path-traversal and zip-bomb protection
 */
export async function extractZipFile(file: File): Promise<ExtractedProject> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const files: Record<string, string> = {};
  let totalSize = 0;
  let entryHtml: string | undefined;

  // Maximum safe size: 25MB uncompressed for web sandbox
  const MAX_SAFE_UNCOMPRESSED = 25 * 1024 * 1024;

  const entries = Object.entries(loadedZip.files);

  for (const [relativePath, zipEntry] of entries) {
    if (zipEntry.dir) continue;

    // Path traversal defense
    const normalizedPath = relativePath.replace(/\\/g, '/');
    if (normalizedPath.includes('../') || normalizedPath.startsWith('/')) {
      console.warn(`Skipped dangerous relative path: ${normalizedPath}`);
      continue;
    }

    // Read content
    const content = await zipEntry.async('string');
    totalSize += content.length;

    if (totalSize > MAX_SAFE_UNCOMPRESSED) {
      throw new Error('ZIP file exceeded safe uncompressed size limit (25MB).');
    }

    files[normalizedPath] = content;

    // Check if entry point
    if (normalizedPath.endsWith('index.html') && (!entryHtml || normalizedPath === 'index.html')) {
      entryHtml = content;
    }
  }

  // Detect Framework
  let detectedFramework = 'Static HTML';
  if (files['package.json']) {
    try {
      const pkg = JSON.parse(files['package.json']);
      if (pkg.dependencies?.react || pkg.devDependencies?.react) {
        detectedFramework = 'React SPA';
      } else if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
        detectedFramework = 'Vue.js';
      } else if (pkg.dependencies?.next) {
        detectedFramework = 'Next.js Static Export';
      } else if (pkg.dependencies?.astro) {
        detectedFramework = 'Astro';
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Fallback if no index.html was at root, check if it's inside a folder e.g. "dist/index.html" or "build/index.html"
  if (!files['index.html'] && entryHtml) {
    files['index.html'] = entryHtml;
  }

  // If still no index.html, create a sensible default
  if (!files['index.html']) {
    files['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Published on SAIPRTAP</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 text-center">
  <div>
    <h1 class="text-3xl font-bold mb-2">Deployed on SAIPRTAP</h1>
    <p class="text-slate-400">Uploaded static assets are live at your sai.app URL.</p>
  </div>
</body>
</html>`;
  }

  return {
    files,
    detectedFramework,
    entryHtml: files['index.html'],
    totalSize,
  };
}

/**
 * Generate a downloadable .zip archive of a project's files
 */
export async function generateProjectZip(projectName: string, files: Record<string, string>): Promise<void> {
  const zip = new JSZip();

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-source.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
