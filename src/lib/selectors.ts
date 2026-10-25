import type { AcademicYearRecord, ChildRecord, TeacherRecord } from '../types';
export const getChild = (children: ChildRecord[], id: string) => children.find(child => child.id === id) || children[0];
export const getAcademicYear = (child: ChildRecord, year: string): AcademicYearRecord => child.academicYears.find(item => item.label === year) || child.academicYears[0];
export const getTeacher = (teachers: TeacherRecord[], id: string) => teachers.find(teacher => teacher.id === id) || teachers[0];
export const availableYears = (child: ChildRecord) => child.academicYears.map(item => item.label);
