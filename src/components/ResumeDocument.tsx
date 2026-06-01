import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import type {
  CommunityItem,
  EducationHistory,
  HonorAndAward,
  Resume,
  WorkExperience,
} from '../types/resume';
import { startEndText } from '../lib/duration';

// 1:1 port of the original Dart `pdf` layout. Units are PDF points, exactly as
// in the source. Same font (standard Helvetica), same metrics, same colours.

const MM = 72 / 25.4;
const LINK = '#3171AC';
const FOOTER_GREY = '#727272';
const CHIP_BORDER = '#EEEEEE'; // PdfColors.grey200
const LOGO = 20;
const LOGO_GAP = 6;
const INDENT = LOGO + LOGO_GAP; // 26 — content sits to the right of the logo column
const SECTION_SPACE = 16; // Dart `sectionSpace` at commit 5e8bce3 (main used 40)

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 20,
    paddingLeft: 44,
    paddingRight: 58,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#000000',
  },
  name: { fontSize: 23 },
  contact: { fontSize: 10 },
  link: { fontSize: 10, color: LINK, textDecoration: 'none' }, // override react-pdf Link's default underline
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  entryTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  entryText: { fontSize: 12 },
  body: { fontSize: 10, lineHeight: 1.3 },
  row: { flexDirection: 'row' },
  logoBox: { width: LOGO, height: LOGO, marginRight: LOGO_GAP },
  logoImg: { width: LOGO, height: LOGO, objectFit: 'contain' },
  entryContent: { flex: 1, marginTop: 1.5 },
  footer: {
    position: 'absolute',
    bottom: 6,
    left: 44,
    right: 58,
    textAlign: 'center',
    fontSize: 10,
    color: FOOTER_GREY,
  },
  skillsWrap: { marginLeft: INDENT, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skill: {
    borderWidth: 1,
    borderColor: CHIP_BORDER,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: { fontSize: 10 },
  // marginBottom mirrors pw.Bullet's default `margin: EdgeInsets.only(bottom: 2mm)`.
  bulletRow: { flexDirection: 'row', marginBottom: 2 * MM },
  bulletDot: {
    width: 1 * MM,
    height: 1 * MM,
    borderRadius: 0.5 * MM,
    backgroundColor: '#000000',
    marginTop: 1.7 * MM,
    marginRight: 0.8 * MM,
  },
});

const Gap = ({ h }: { h: number }) => <View style={{ height: h }} />;

// Same blue text as the Dart port, but a real clickable PDF link annotation.
// (A deliberate enhancement over the 1:1 port — Dart renders these as plain Text.)
function ContactLink({ value }: { value: string }) {
  if (!value) return <Text style={styles.link}>{value}</Text>;
  const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return (
    <Link style={styles.link} src={href}>
      {value}
    </Link>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Gap h={4} />
      {children}
    </View>
  );
}

function EntryRow({
  logo,
  top,
  children,
}: {
  logo: string | null;
  top: number;
  children: ReactNode;
}) {
  return (
    // wrap={false} mirrors the Dart MultiPage behaviour of keeping an entry
    // together rather than splitting it across a page boundary.
    <View style={[styles.row, { marginTop: top }]} wrap={false}>
      <View style={styles.logoBox}>
        {logo ? <Image style={styles.logoImg} src={logo} /> : null}
      </View>
      <View style={styles.entryContent}>{children}</View>
    </View>
  );
}

function ExperienceEntry({ e, isFirst }: { e: WorkExperience; isFirst: boolean }) {
  const points = e.summary.filter(Boolean);
  return (
    <EntryRow logo={e.companyLogo} top={isFirst ? 2 : 14}>
      <Text style={styles.entryTitle}>{e.position}</Text>
      <Gap h={2} />
      <Text style={styles.entryText}>{e.company}</Text>
      <Gap h={3} />
      <Text style={styles.body}>{startEndText(e.startDate, e.endDate)}</Text>
      {points.length > 0 && <Gap h={3} />}
      {points.map((p, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={[styles.body, { flex: 1 }]}>{p}</Text>
        </View>
      ))}
    </EntryRow>
  );
}

function EducationEntry({ e, isFirst }: { e: EducationHistory; isFirst: boolean }) {
  return (
    <EntryRow logo={e.schoolLogo} top={isFirst ? 2 : 16}>
      <Text style={styles.entryTitle}>{e.schoolName}</Text>
      <Gap h={2} />
      <Text style={styles.entryText}>{`${e.degree}, ${e.field}`}</Text>
      <Gap h={3} />
      <Text style={styles.body}>{`${e.startDate} - ${e.endDate}`}</Text>
    </EntryRow>
  );
}

function CommunityEntry({ c, isFirst }: { c: CommunityItem; isFirst: boolean }) {
  return (
    <EntryRow logo={c.logo || null} top={isFirst ? 2 : 14}>
      <Text style={styles.entryTitle}>{c.title}</Text>
      {c.link ? (
        <>
          <Gap h={2} />
          <Text style={styles.entryText}>{c.link}</Text>
        </>
      ) : null}
      <Gap h={3} />
      <Text style={styles.body}>{c.date}</Text>
      <Gap h={3} />
      <Text style={styles.body}>{c.summary}</Text>
    </EntryRow>
  );
}

function HonorEntry({ h, isFirst }: { h: HonorAndAward; isFirst: boolean }) {
  return (
    <EntryRow logo={null} top={isFirst ? 2 : 16}>
      <Text style={styles.entryTitle}>{h.title}</Text>
      <Gap h={2} />
      <Text style={styles.body}>{h.date}</Text>
      {h.info ? (
        <>
          <Gap h={3} />
          <Text style={styles.body}>{h.info}</Text>
        </>
      ) : null}
    </EntryRow>
  );
}

export function ResumeDocument({ resume }: { resume: Resume }) {
  const skills = resume.skills.filter(Boolean);
  return (
    <Document title={`${resume.fullName} Resume`} author={resume.fullName}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{resume.fullName}</Text>
          <Gap h={4} />
          <Text style={styles.contact}>{resume.location}</Text>
          <Gap h={4} />
          <Text style={styles.contact}>{resume.email}</Text>
          <Gap h={4} />
          <View style={styles.row}>
            <ContactLink value={resume.github} />
            <View style={{ width: 24 }} />
            <ContactLink value={resume.linkedIn} />
          </View>
        </View>

        <Gap h={SECTION_SPACE} />
        <Section title="Summary">
          <Text style={styles.body}>{resume.summary}</Text>
        </Section>

        <Gap h={SECTION_SPACE} />
        <Section title="Experience">
          {resume.experience.map((e, i) => (
            <ExperienceEntry key={i} e={e} isFirst={i === 0} />
          ))}
        </Section>

        <Gap h={SECTION_SPACE * 2} />
        <Section title="Education">
          {resume.education.map((e, i) => (
            <EducationEntry key={i} e={e} isFirst={i === 0} />
          ))}
        </Section>

        <Gap h={SECTION_SPACE * 2} />
        {resume.communityAndOpenSource.length > 0 && (
          <>
            <Section title="Community & Open Source">
              {resume.communityAndOpenSource.map((c, i) => (
                <CommunityEntry key={i} c={c} isFirst={i === 0} />
              ))}
            </Section>
            <Gap h={SECTION_SPACE * 3} />
          </>
        )}

        {resume.honorsAndAwards.length > 0 && (
          <>
            <Section title="Honor & Awards">
              {resume.honorsAndAwards.map((h, i) => (
                <HonorEntry key={i} h={h} isFirst={i === 0} />
              ))}
            </Section>
            <Gap h={SECTION_SPACE} />
          </>
        )}

        <Section title="Skills">
          <Gap h={2} />
          <View style={styles.skillsWrap}>
            {skills.map((s, i) => (
              <View key={i} style={styles.skill}>
                <Text style={styles.skillText}>{s}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `${resume.fullName} - Page ${pageNumber} / ${totalPages}` : ''
          }
        />
      </Page>
    </Document>
  );
}
