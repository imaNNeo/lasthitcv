// Renders the ORIGINAL project's bin/data.json through the ported document,
// for a like-for-like comparison against example.pdf.
import { renderToFile } from '@react-pdf/renderer';
import { readFileSync } from 'node:fs';
import { ResumeDocument } from '../src/components/ResumeDocument';
import { normalizeResume } from '../src/types/resume';

const dataPath = process.argv[2];
if (!dataPath) {
  console.error('Usage: node <bundle>.mjs <path-to-dart-repo>/bin/data.json');
  process.exit(1);
}
const json = JSON.parse(readFileSync(dataPath, 'utf8'));
await renderToFile(<ResumeDocument resume={normalizeResume(json)} />, '/tmp/lasthit_full.pdf');
console.log('rendered /tmp/lasthit_full.pdf');
