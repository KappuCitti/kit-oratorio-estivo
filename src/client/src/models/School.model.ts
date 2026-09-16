export interface School {
  id: number | string;
  name: string;
  canChooseActivities: boolean;
  classes: Omit<Class, 'school'>[];
}

export interface Class {
  id: number | string;
  name: string;
  school: Omit<School, 'classes'>;
}
