import { className, schoolType } from './Enrollment.model';
import { Child, gender, Parent } from './Family.model';

export interface Request {
  page?: number;
  size?: number;
}

export interface EnrollmentGetRequest extends Request {
  year: number;
  weekId?: number | string;
  teamId?: number | string;
  query?: string;
  schoolId?: number;
  classId?: number;
}

export interface EnrollmentUpdateRequest {
  id: number | string;
  team: number | string | null;
  shirt: number | string | null;
  weeks: { id: number | string; isPaid: boolean }[];
  dataProcessingConsent: boolean;
  exitAuthorization: boolean;
  // TODO - Change
  schoolType: schoolType;
  className: className;
  section: string;
  year: number;
  parentNotes: string | null;
  managerNotes: string | null;
}

export interface EnrollmentCreateRequest {
  child: number;
  team: number | string | null;
  shirt: number | string | null;
  weeks: { id: number | string; isPaid: boolean }[];
  dataProcessingConsent: boolean;
  exitAuthorization: boolean;
  schoolType: schoolType;
  className: className;
  section: string;
  year: number;
  parentNotes: string | null;
  managerNotes: string | null;
}

export interface FamilyEnrollmentCreateRequest {
  childs: (Child & {
    enrollments?: {
      team: number | string | null;
      shirt: number | string | null;
      weeks: { id: number | string; isPaid: boolean }[];
      dataProcessingConsent: boolean;
      exitAuthorization: boolean;
      schoolType: schoolType;
      className: className;
      section: string;
      year: number;
      parentNotes: string | null;
      managerNotes: string | null;
    }[];
  })[];
  parents: Parent[];
}

export interface PeopleGetRequest extends Request {
  query?: string;
  gender?: gender;
}

export interface TeamCreateRequest {
  name: string;
  color: string;
}

export interface TeamUpdateRequest {
  id: number | string;
  name?: string;
  color?: string;
  child?: {
    type: 'SET' | 'ADD';
    ids: number[];
  };
}
export interface SchoolCreateRequest {
  name: string;
  canChooseActivities: boolean;
}

export interface ClassCreateRequest {
  name: string;
  // Il server si aspetta `schoolId` (e un numero): era scritto `schooldId`,
  // quindi la chiamata sarebbe stata rifiutata con 422 appena collegata alla UI.
  schoolId: number;
}
