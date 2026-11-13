import schoolConfig from "../../../shared/school-config.json";

export type SchoolConfiguration = typeof schoolConfig;
export type SchoolDocumentConfiguration = typeof schoolConfig.parentApp.documents;
export type GuardianContentConfiguration = typeof schoolConfig.guardianContent;

export function getSchoolConfiguration(): SchoolConfiguration {
  return schoolConfig;
}

export function getSchoolDocumentConfiguration(): SchoolDocumentConfiguration {
  return schoolConfig.parentApp.documents;
}
