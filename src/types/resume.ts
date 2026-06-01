// Resume data model. Mirrors the original Dart `ResumeData` so existing
// data.json files import cleanly.

import sampleData from '../data/sample.json';

export interface WorkExperience {
  company: string;
  /** Remote URL or an inlined data: URL from an upload. */
  companyLogo: string | null;
  position: string;
  startDate: string;
  endDate: string;
  summary: string[];
}

export interface EducationHistory {
  schoolName: string;
  schoolLogo: string | null;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface CommunityItem {
  title: string;
  link: string | null;
  date: string;
  summary: string;
  logo: string;
}

export interface HonorAndAward {
  title: string;
  date: string;
  info: string;
}

export interface Resume {
  fullName: string;
  location: string;
  email: string;
  linkedIn: string;
  github: string;
  summary: string;
  experience: WorkExperience[];
  education: EducationHistory[];
  communityAndOpenSource: CommunityItem[];
  skills: string[];
  honorsAndAwards: HonorAndAward[];
}

// --- factories ---------------------------------------------------------------

export const emptyExperience = (): WorkExperience => ({
  company: '',
  companyLogo: null,
  position: '',
  startDate: '',
  endDate: '',
  summary: [''],
});

export const emptyEducation = (): EducationHistory => ({
  schoolName: '',
  schoolLogo: null,
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
});

export const emptyCommunity = (): CommunityItem => ({
  title: '',
  link: null,
  date: '',
  summary: '',
  logo: '',
});

export const emptyHonor = (): HonorAndAward => ({ title: '', date: '', info: '' });

export const emptyResume = (): Resume => ({
  fullName: '',
  location: '',
  email: '',
  linkedIn: '',
  github: '',
  summary: '',
  experience: [],
  education: [],
  communityAndOpenSource: [],
  skills: [],
  honorsAndAwards: [],
});

// --- tolerant import ---------------------------------------------------------
// Accepts arbitrary JSON (incl. the original data.json which omits
// communityAndOpenSource) and coerces it into a valid Resume.

type Dict = Record<string, unknown>;
const asDict = (v: unknown): Dict => (v && typeof v === 'object' ? (v as Dict) : {});
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const strOrNull = (v: unknown): string | null => (typeof v === 'string' ? v : null);
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

function normExp(v: unknown): WorkExperience {
  const o = asDict(v);
  return {
    company: str(o.company),
    companyLogo: strOrNull(o.companyLogo),
    position: str(o.position),
    startDate: str(o.startDate),
    endDate: str(o.endDate),
    summary: strArr(o.summary),
  };
}

function normEdu(v: unknown): EducationHistory {
  const o = asDict(v);
  return {
    schoolName: str(o.schoolName),
    schoolLogo: strOrNull(o.schoolLogo),
    degree: str(o.degree),
    field: str(o.field),
    startDate: str(o.startDate),
    endDate: str(o.endDate),
  };
}

function normCommunity(v: unknown): CommunityItem {
  const o = asDict(v);
  return {
    title: str(o.title),
    link: strOrNull(o.link),
    date: str(o.date),
    summary: str(o.summary),
    logo: str(o.logo),
  };
}

function normHonor(v: unknown): HonorAndAward {
  const o = asDict(v);
  return { title: str(o.title), date: str(o.date), info: str(o.info) };
}

export function normalizeResume(input: unknown): Resume {
  const o = asDict(input);
  return {
    fullName: str(o.fullName),
    location: str(o.location),
    email: str(o.email),
    linkedIn: str(o.linkedIn),
    github: str(o.github),
    summary: str(o.summary),
    experience: Array.isArray(o.experience) ? o.experience.map(normExp) : [],
    education: Array.isArray(o.education) ? o.education.map(normEdu) : [],
    communityAndOpenSource: Array.isArray(o.communityAndOpenSource)
      ? o.communityAndOpenSource.map(normCommunity)
      : [],
    skills: strArr(o.skills),
    honorsAndAwards: Array.isArray(o.honorsAndAwards)
      ? o.honorsAndAwards.map(normHonor)
      : [],
  };
}

// --- seed data ---------------------------------------------------------------
// Fictitious placeholder resume, shown by default until the user imports their
// own or starts editing.

export function sampleResume(): Resume {
  return normalizeResume(sampleData);
}
