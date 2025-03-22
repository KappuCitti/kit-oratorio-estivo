import Enrollment, { className, schoolType } from './Enrollment.model';
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
  schoolType?: schoolType;
  className?: className;
}

export interface EnrollmentUpdateRequest {
  id: number | string;
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
    enrollments: {
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

export interface ChildsGetRequest extends Request {
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
