// Node-side render for verification: produces a real PDF from the same
// ResumeDocument used in the browser. Run with:  npx tsx scripts/render-sample.tsx
import { renderToFile } from '@react-pdf/renderer';
import { ResumeDocument } from '../src/components/ResumeDocument';
import { sampleResume } from '../src/types/resume';

await renderToFile(<ResumeDocument resume={sampleResume()} />, '/tmp/lasthit_sample.pdf');
console.log('rendered /tmp/lasthit_sample.pdf');
