import { Family, gender } from './Family.model';
import { Shirt } from './Shirt.model';
import Team from './Team.model';
import { UserSimplified } from './User.model';
import Week from './Week.model';

// TODO - New
export interface EnrollmentSearch {
  // id: number;
  // dataProcessingConsent: boolean;
  // exitAuthorization: boolean;
  // schoolType: schoolType;
  // className: className;
  // section: string;
  // child: EnrollmentChildearch;
  // weeks: EnrollmentWeekSearch[];
  // team: Team;
  id: number;
  dataProcessingConsent: boolean;
  imageProcessingConsent: boolean;
  exitAuthorization: boolean;
  section: string;
  specialDiet: any;
  user: UserSimplified;
  weeks: EnrollmentWeekSearch[];
  team: Team;
  class: EnrollmentClass;
  school: EnrollmentSchool;
}
export interface EnrollmentChildSearch {
  id: number;
  name: string;
  surname: string;
  gender: gender;
}
export interface EnrollmentWeekSearch {
  weekId: number | string;
  isPaid: number | boolean; // TODO - Change to boolean
}

export default interface Enrollment {
  id: number | string;
  className: className;
  section: string;
  dataProcessingConsent: boolean;
  imageProcessingConsent: boolean;
  exitAuthorization: boolean;
  schoolType: schoolType;
  managerNotes: string;
  parentNotes: string;
  year: number;
  dateOfEnrollment: string;
  family: Family;
  shirt: Shirt;
  team: Team;
  weeks: EnrollmentWeek[];
}

export interface EnrollmentClass {
  id: number;
  name: string;
}
export interface EnrollmentSchool {
  id: number;
  name: string;
}
export interface EnrollmentWeek extends Week {
  isPaid: boolean;
}

export type schoolType = string; // 'Primary' | 'Secondary';
export type className = string; // 'I' | 'II' | 'III' | 'IV' | 'V';
