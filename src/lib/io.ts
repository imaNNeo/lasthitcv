import type { Resume } from '../types/resume';
import { normalizeResume } from '../types/resume';

/** Trigger a browser download of `blob` under `filename`. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportJson(resume: Resume, filename = 'lasthitcv.json'): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, filename);
}

export async function importJson(file: File): Promise<Resume> {
  const text = await file.text();
  return normalizeResume(JSON.parse(text));
}
