import Address from './Address.model';

export interface Family {
  child: Child;
  parents: Parent[];
}

export type gender = 'M' | 'F' | 'Other';

export interface PeopleSearch {
  id: number;
  name: string;
  surname: gender;
  gender: string;
  type?: string;
}

export interface Child {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string;
  birthPlace: string;
  address: Address;
}

export interface ChildSearch {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string;
}

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
