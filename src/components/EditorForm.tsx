import type { ReactNode } from 'react';
import type { Resume } from '../types/resume';
import {
  emptyCommunity,
  emptyEducation,
  emptyExperience,
  emptyHonor,
} from '../types/resume';
import LogoInput from './LogoInput';
import StringListInput from './StringListInput';

interface Props {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

function updateItem<T>(arr: T[], index: number, patch: Partial<T>): T[] {
  return arr.map((item, i) => (i === index ? { ...item, ...patch } : item));
}
function removeItem<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

export default function EditorForm({ resume, onChange }: Props) {
  const set = (patch: Partial<Resume>) => onChange({ ...resume, ...patch });
  const setExp = (i: number, patch: Partial<Resume['experience'][number]>) =>
    set({ experience: updateItem(resume.experience, i, patch) });
  const setEdu = (i: number, patch: Partial<Resume['education'][number]>) =>
    set({ education: updateItem(resume.education, i, patch) });
  const setCom = (i: number, patch: Partial<Resume['communityAndOpenSource'][number]>) =>
    set({ communityAndOpenSource: updateItem(resume.communityAndOpenSource, i, patch) });
  const setHon = (i: number, patch: Partial<Resume['honorsAndAwards'][number]>) =>
    set({ honorsAndAwards: updateItem(resume.honorsAndAwards, i, patch) });

  return (
    <div className="form">
      <Group title="Basics">
        <Field label="Full name" value={resume.fullName} onChange={(v) => set({ fullName: v })} />
        <Field
          label="Location"
          value={resume.location}
          onChange={(v) => set({ location: v })}
          placeholder="City, Country"
        />
        <div className="row2">
          <Field label="Email" type="email" value={resume.email} onChange={(v) => set({ email: v })} />
          <Field
            label="LinkedIn"
            value={resume.linkedIn}
            onChange={(v) => set({ linkedIn: v })}
            placeholder="linkedin.com/in/…"
          />
        </div>
        <Field
          label="GitHub"
          value={resume.github}
          onChange={(v) => set({ github: v })}
          placeholder="github.com/…"
        />
        <Field
          label="Summary"
          textarea
          value={resume.summary}
          onChange={(v) => set({ summary: v })}
          placeholder="Short professional summary"
        />
      </Group>

      <Group title="Experience">
        {resume.experience.map((exp, i) => (
          <div className="card" key={i}>
            <CardHead
              label={`Experience ${i + 1}`}
              onRemove={() => set({ experience: removeItem(resume.experience, i) })}
            />
            <Field label="Company" value={exp.company} onChange={(v) => setExp(i, { company: v })} />
            <Field label="Position" value={exp.position} onChange={(v) => setExp(i, { position: v })} />
            <div className="row2">
              <Field
                label="Start"
                value={exp.startDate}
                onChange={(v) => setExp(i, { startDate: v })}
                placeholder="May 2025"
              />
              <Field
                label="End"
                value={exp.endDate}
                onChange={(v) => setExp(i, { endDate: v })}
                placeholder="Present"
              />
            </div>
            <LogoInput
              label="Company logo"
              value={exp.companyLogo}
              onChange={(v) => setExp(i, { companyLogo: v })}
            />
            <StringListInput
              label="Highlights"
              items={exp.summary}
              onChange={(items) => setExp(i, { summary: items })}
              placeholder="Something you built or achieved"
            />
          </div>
        ))}
        <AddButton
          label="Add experience"
          onClick={() => set({ experience: [...resume.experience, emptyExperience()] })}
        />
      </Group>

      <Group title="Education">
        {resume.education.map((edu, i) => (
          <div className="card" key={i}>
            <CardHead
              label={`Education ${i + 1}`}
              onRemove={() => set({ education: removeItem(resume.education, i) })}
            />
            <Field label="School" value={edu.schoolName} onChange={(v) => setEdu(i, { schoolName: v })} />
            <div className="row2">
              <Field label="Degree" value={edu.degree} onChange={(v) => setEdu(i, { degree: v })} />
              <Field label="Field" value={edu.field} onChange={(v) => setEdu(i, { field: v })} />
            </div>
            <div className="row2">
              <Field label="Start" value={edu.startDate} onChange={(v) => setEdu(i, { startDate: v })} />
              <Field label="End" value={edu.endDate} onChange={(v) => setEdu(i, { endDate: v })} />
            </div>
            <LogoInput
              label="School logo"
              value={edu.schoolLogo}
              onChange={(v) => setEdu(i, { schoolLogo: v })}
            />
          </div>
        ))}
        <AddButton
          label="Add education"
          onClick={() => set({ education: [...resume.education, emptyEducation()] })}
        />
      </Group>

      <Group title="Skills">
        <StringListInput
          label="Skills"
          items={resume.skills}
          onChange={(items) => set({ skills: items })}
          placeholder="e.g. Kotlin"
        />
      </Group>

      <Group title="Community & Open Source">
        {resume.communityAndOpenSource.map((c, i) => (
          <div className="card" key={i}>
            <CardHead
              label={`Item ${i + 1}`}
              onRemove={() =>
                set({ communityAndOpenSource: removeItem(resume.communityAndOpenSource, i) })
              }
            />
            <Field label="Title" value={c.title} onChange={(v) => setCom(i, { title: v })} />
            <div className="row2">
              <Field
                label="Link"
                value={c.link ?? ''}
                onChange={(v) => setCom(i, { link: v || null })}
                placeholder="github.com/…"
              />
              <Field label="Date" value={c.date} onChange={(v) => setCom(i, { date: v })} />
            </div>
            <Field label="Summary" textarea value={c.summary} onChange={(v) => setCom(i, { summary: v })} />
            <LogoInput
              label="Logo"
              value={c.logo || null}
              onChange={(v) => setCom(i, { logo: v ?? '' })}
            />
          </div>
        ))}
        <AddButton
          label="Add community item"
          onClick={() =>
            set({ communityAndOpenSource: [...resume.communityAndOpenSource, emptyCommunity()] })
          }
        />
      </Group>

      <Group title="Honors & Awards">
        {resume.honorsAndAwards.map((h, i) => (
          <div className="card" key={i}>
            <CardHead
              label={`Award ${i + 1}`}
              onRemove={() => set({ honorsAndAwards: removeItem(resume.honorsAndAwards, i) })}
            />
            <div className="row2">
              <Field label="Title" value={h.title} onChange={(v) => setHon(i, { title: v })} />
              <Field label="Date" value={h.date} onChange={(v) => setHon(i, { date: v })} />
            </div>
            <Field
              label="Info"
              value={h.info}
              onChange={(v) => setHon(i, { info: v })}
              placeholder="Optional detail"
            />
          </div>
        ))}
        <AddButton
          label="Add award"
          onClick={() => set({ honorsAndAwards: [...resume.honorsAndAwards, emptyHonor()] })}
        />
      </Group>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="group">
      <h3 className="group-title">{title}</h3>
      {children}
    </section>
  );
}

function CardHead({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="card-head">
      <strong>{label}</strong>
      <button type="button" className="link-btn" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="add-btn block" onClick={onClick}>
      + {label}
    </button>
  );
}
