import dayjs from 'dayjs';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED'
}

export interface User {
  id: number;
  login: string;
  password: string;
  create: dayjs.Dayjs;
  update: dayjs.Dayjs;
}
