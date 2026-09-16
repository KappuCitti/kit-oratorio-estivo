export default interface Week {
  id: number;
  price: string;
  maxEnrollments: number;

  startDate: Date;
  endDate: Date;

  registrationOpenDate: Date;
  registrationCloseDate: Date;
}
