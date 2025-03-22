import { Family, gender } from './Family.model';
import { Shirt } from './Shirt.model';
import Team from './Team.model';
import Week from './Week.model';

export interface EnrollmentSearch {
  id: number;
  dataProcessingConsent: boolean;
  exitAuthorization: boolean;
  schoolType: schoolType;
  className: className;
  section: string;
  child: EnrollmentChildearch;
  weeks: EnrollmentWeekSearch[];
  team: Team;
}
export interface EnrollmentChildearch {
  id: number;
  name: string;
  surname: string;
  gender: gender;
}
export interface EnrollmentWeekSearch {
  weekId: number | string;
  isPaid: boolean;
}

export default interface Enrollment {
  id: number | string;
  className: className;
  section: string;
  dataProcessingConsent: boolean;
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
export interface EnrollmentWeek extends Week {
  isPaid: boolean;
}

export type schoolType = 'Primary' | 'Secondary';
export type className = 'I' | 'II' | 'III' | 'IV' | 'V';
