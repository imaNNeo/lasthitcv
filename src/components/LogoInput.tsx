import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fileToLogoDataUrl } from '../lib/logo';

interface Props {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function LogoInput({ label, value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToLogoDataUrl(file));
    } catch {
      alert('Could not process that image.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="logo-input">
      <span className="field-label">{label}</span>
      <div className="logo-input-row">
        {value ? (
          <img className="logo-thumb" src={value} alt="" />
        ) : (
          <span className="logo-thumb placeholder" aria-hidden="true" />
        )}
        <input
          type="text"
          placeholder="Paste an image URL"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
        />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? '…' : 'Upload'}
        </button>
        {value && (
          <button type="button" className="link-btn" onClick={() => onChange(null)}>
            ✕
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFile}
        />
      </div>
    </div>
  );
}
