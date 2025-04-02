export interface AttendanceSearch extends Attendance {
  id: number | string;
  childId: number | string;
  childName: string;
  childSurname: string;
}

export default interface Attendance {
  enrollmentId: number | string;
  date: Date;
  present: boolean;
  eatsInOratory: boolean;
  eatsPlain: boolean;
}
