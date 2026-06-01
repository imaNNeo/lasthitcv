// Renders the ORIGINAL project's bin/data.json through the ported document,
// for a like-for-like comparison against example.pdf.
import { renderToFile } from '@react-pdf/renderer';
import { readFileSync } from 'node:fs';
import { ResumeDocument } from '../src/components/ResumeDocument';
import { normalizeResume } from '../src/types/resume';

const json = JSON.parse(
  readFileSync(
    '/Users/neo/IdeaProjects/linkedin_like_resume_generator/bin/data.json',
    'utf8',
  ),
);
await renderToFile(<ResumeDocument resume={normalizeResume(json)} />, '/tmp/lasthit_full.pdf');
console.log('rendered /tmp/lasthit_full.pdf');
