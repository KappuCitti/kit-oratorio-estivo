import Address from './Address.model';
import Enrollment from './Enrollment.model';
import { Role } from './User.model';

export interface Family {
  child: Child;
  parents: Parent[];
}

export type gender = 'M' | 'F' | 'Other';

// TODO - Old
export interface PeopleSearch {
  id: number;
  name: string;
  surname: gender;
  gender: string;
  type?: string;
}

// TODO - New
export interface FamilyMember {
  id: string;
  email: string | null;
  phone: string | null;
  role: Role;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string | null;
  birthPlace: string | null;
}

// TODO - Old
export interface Child {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string;
  birthPlace: string;
  address: Address;
}

// TODO - Old
export interface ChildSearch {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string;
}

export type ChildResponse = Child & {
  enrollments: Enrollment[];
  parents: Parent[];
};

export interface Parent {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  email: string;
  phoneNumber: string;
}

export interface ParentSearch {
  id: number;
  name: string;
  surname: string;
  gender: gender;
}

export type ParentResponse = Parent & { childrens: Child[] };
