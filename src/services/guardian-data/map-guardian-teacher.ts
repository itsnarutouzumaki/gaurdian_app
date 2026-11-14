import type { TeacherRecord } from "../../types";
import type { GuardianBootstrapChild } from "./guardian-bootstrap.types";

export function mapGuardianTeacher(
  teacher: GuardianBootstrapChild["teachers"][number],
  children: GuardianBootstrapChild[],
): TeacherRecord {
  const classes = children.flatMap((child) =>
    child.subjectAssignments.some((assignment) => assignment.teacherId === teacher._id)
      ? [`${child.classSection?.className ?? ""} ${child.classSection?.section ?? ""}`.trim()]
      : [],
  );
  const qualifications = teacher.qualifications ?? [];
  return {
    id: teacher._id,
    name: teacher.displayName,
    photoUrl: teacher.photoUrl ?? "",
    designation: teacher.designation ?? "Teacher",
    subjects: teacher.subjects ?? [],
    highestDegree: qualifications[0] ?? "",
    qualifications: qualifications.map((degree) => ({ degree, institution: "", year: "" })),
    experienceYears: teacher.experienceYears ?? 0,
    specialization: teacher.specialization ?? "",
    about: teacher.biography ?? "",
    email: "",
    phone: "",
    classes: [...new Set(classes)],
    languages: teacher.languages ?? [],
    awards: [],
    officeHours: "",
    isActive: true,
  };
}
