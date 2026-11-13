import type {
  ExaminationRecord,
  SubjectRecord,
} from "../types";

export type ExaminationReport = {
  title: string;
  date: string;
  subjects: Array<{
    id: string;
    name: string;
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  totalScore: number;
  maxScore: number;
  percentage: number;
};

export function buildExaminationReport(
  examination: ExaminationRecord,
  availableSubjects: SubjectRecord[],
): ExaminationReport {
  const subjects = examination.subjects.map((result) => {
    const subject = availableSubjects.find(
      (item) => item.id === result.subjectId,
    );
    if (!subject) {
      throw new Error(
        `Examination ${examination.id} references unknown subject ${result.subjectId}.`,
      );
    }
    if (
      !Number.isFinite(result.score) ||
      !Number.isFinite(result.maxScore) ||
      result.maxScore <= 0 ||
      result.score < 0 ||
      result.score > result.maxScore
    ) {
      throw new Error(
        `Examination ${examination.id} has invalid marks for ${subject.name}.`,
      );
    }
    return {
      id: subject.id,
      name: subject.name,
      score: result.score,
      maxScore: result.maxScore,
      percentage: Math.round((result.score / result.maxScore) * 1000) / 10,
    };
  });
  const totalScore = subjects.reduce((total, subject) => total + subject.score, 0);
  const maxScore = subjects.reduce(
    (total, subject) => total + subject.maxScore,
    0,
  );
  return {
    title: examination.title,
    date: examination.date,
    subjects,
    totalScore,
    maxScore,
    percentage:
      maxScore > 0 ? Math.round((totalScore / maxScore) * 1000) / 10 : 0,
  };
}
