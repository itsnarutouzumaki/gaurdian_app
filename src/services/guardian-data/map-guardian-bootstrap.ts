import type { GuardianAppData, GuardianBootstrap } from "./guardian-bootstrap.types";
import { mapGuardianChild } from "./map-guardian-child";
import { mapGuardianTeacher } from "./map-guardian-teacher";

function titleCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

export function mapGuardianBootstrap(snapshot: GuardianBootstrap): GuardianAppData {
  const mappedChildren = snapshot.children.map((child) =>
    mapGuardianChild(
      child,
      child.academicYears,
      snapshot.school?.currentAcademicYearId,
    ),
  );
  const rawTeachers = new Map(
    snapshot.children.flatMap((child) => child.teachers.map((teacher) => [teacher._id, teacher] as const)),
  );
  const complaints = snapshot.complaints.map((item) => ({
    id: item._id,
    childId: item.studentId,
    subject: item.subject,
    message: item.message,
    attachmentName: item.attachmentFileIds.length ? "Attachment" : null,
    status: titleCase(item.status),
    createdAt: item.createdAt,
  }));
  const leaveRequests = snapshot.leaveRequests.map((item) => ({
    id: item._id,
    childId: item.studentId,
    startDate: item.startsOn,
    endDate: item.endsOn,
    reason: item.reason,
    status: titleCase(item.status),
    createdAt: item.createdAt,
  }));
  const linkRequests = snapshot.childLinkRequests.map((item) => ({
    id: item._id,
    studentNumber: item.proposedStudentNumber,
    status: titleCase(item.status),
    createdAt: item.createdAt,
  }));
  const notifications = snapshot.notifications.map((item) => ({
    id: item.eventId,
    type: item.eventType,
    title: item.subject,
    message: item.body,
    dateLabel: item.createdAt,
    read: Boolean(item.readAt),
    ...(item.routeParams?.childId ? { childId: item.routeParams.childId } : {}),
  }));
  return {
    guardian: {
      id: snapshot.account.profile.id,
      fullName: snapshot.account.profile.fullName,
      mobileNumber: snapshot.account.profile.phone,
      email: snapshot.account.profile.email,
      profilePhotoUrl: null,
      address: snapshot.account.profile.address ?? "",
      relationship: snapshot.account.profile.relationship,
      profileComplete: Boolean(
        snapshot.account.profile.fullName
        && snapshot.account.profile.phone
        && snapshot.account.profile.email,
      ),
    },
    children: mappedChildren.map((item) => item.child),
    examinations: mappedChildren.flatMap((item) => item.examinations),
    complaints,
    leaveRequests,
    linkRequests,
    notifications,
    teachers: [...rawTeachers.values()].map((teacher) =>
      mapGuardianTeacher(teacher, snapshot.children),
    ),
  };
}
