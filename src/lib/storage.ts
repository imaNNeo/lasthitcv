import type { Resume } from '../types/resume';
import { normalizeResume } from '../types/resume';

const KEY = 'lasthitcv:resume:v1';

export function loadResume(): Resume | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalizeResume(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

interface SaveResult {
  ok: boolean;
  error?: string;
}

export function saveResume(resume: Resume): SaveResult {
  try {
    localStorage.setItem(KEY, JSON.stringify(resume));
    return { ok: true };
  } catch (e) {
    // Most likely QuotaExceededError — e.g. too many large inlined logos.
    return { ok: false, error: e instanceof Error ? e.message : 'Could not save' };
  }
}
