import { EnrollmentSearch } from './Enrollment.model';
import { UserSimplified } from './User.model';

export interface AttendanceSearch {
  id: number;
  enrollmentId: number;
  eatsInOratory: boolean;
  user: UserSimplified;
}

// mix enrollmentId with attendance in one type
export type EnrollmentAttendanceSearch = EnrollmentSearch & {
  present: boolean;
  attendance?: AttendanceSearch;
};

//   eatsPlain: boolean;
// }
