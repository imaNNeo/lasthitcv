import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { pdf, usePDF } from '@react-pdf/renderer';
import type { Resume } from '../types/resume';
import { emptyResume, sampleResume } from '../types/resume';
import { loadResume, saveResume } from '../lib/storage';
import { downloadBlob, exportJson, importJson } from '../lib/io';
import { ResumeDocument } from './ResumeDocument';
import EditorForm from './EditorForm';

export default function ResumeEditor() {
  const [resume, setResume] = useState<Resume>(() => loadResume() ?? sampleResume());
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [instance, updateInstance] = usePDF({ document: <ResumeDocument resume={resume} /> });

  // Debounced: autosave to localStorage and regenerate the PDF preview.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const result = saveResume(resume);
      setSaveError(result.ok ? null : result.error ?? 'Could not save');
      updateInstance(<ResumeDocument resume={resume} />);
    }, 400);
    return () => window.clearTimeout(id);
    // updateInstance is stable across renders; `resume` is the trigger.
  }, [resume]);

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setResume(await importJson(file));
    } catch {
      alert('That file is not valid LastHitCV JSON.');
    } finally {
      e.target.value = '';
    }
  }

  async function downloadPdf() {
    const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
    downloadBlob(blob, `${(resume.fullName || 'resume').trim() || 'resume'}.pdf`);
  }

  return (
    <div className="app">
      <header className="toolbar">
        <span className="brand">
          LastHit<span className="brand-accent">CV</span>
        </span>
        <div className="toolbar-actions">
          <button onClick={downloadPdf}>Export PDF</button>
          <button onClick={() => exportJson(resume)}>Export JSON</button>
          <button onClick={() => fileRef.current?.click()}>Import JSON</button>
          <button onClick={() => setResume(sampleResume())}>Load sample</button>
          <button
            className="ghost"
            onClick={() => {
              if (confirm('Clear the whole resume?')) setResume(emptyResume());
            }}
          >
            Reset
          </button>
          {saveError && (
            <span className="save-error" title={saveError}>
              ⚠ Not saved
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImport}
        />
      </header>

      <main className="workspace">
        <section className="pane form-pane">
          <EditorForm resume={resume} onChange={setResume} />
        </section>
        <section className="pane preview-pane">
          {instance.url ? (
            <iframe className="pdf-frame" src={instance.url} title="Resume preview" />
          ) : (
            <div className="pdf-status">
              {instance.error ? `Preview error: ${instance.error}` : 'Rendering preview…'}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
