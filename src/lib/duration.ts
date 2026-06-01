// Ports the original Dart `StartEndText` duration logic so the experience
// date line reads identically, e.g. "May 2018 - Nov 2022 (4 years 7 months)".

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

interface YM {
  y: number;
  m: number;
}

function parseYM(date: string): YM | null {
  const parts = date.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const m = MONTHS[parts[0]];
  const y = parseInt(parts[1], 10);
  if (!m || !Number.isFinite(y)) return null;
  return { y, m };
}

function addOneMonth({ y, m }: YM): YM {
  let nm = m + 1;
  let ny = y;
  if (nm > 12) {
    nm = 1;
    ny++;
  }
  return { y: ny, m: nm };
}

function formatDiff(start: YM, end: YM): string {
  const e = addOneMonth(end);
  let years = e.y - start.y;
  let months = e.m - start.m;
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years > 0 && months > 0) return `${years} years ${months} months`;
  if (years > 0) return years === 1 ? '1 year' : `${years} years`;
  if (months > 0) return months === 1 ? '1 month' : `${months} months`;
  return '0 months';
}

export function startEndText(start: string, end: string): string {
  let text = `${start} - ${end}`;
  if (end.toLowerCase() !== 'present') {
    const s = parseYM(start);
    const e = parseYM(end);
    if (s && e) text += ` (${formatDiff(s, e)})`;
  }
  return text;
}
