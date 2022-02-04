import dayjs from 'dayjs';
import { Clock } from '../../core/utils/clock';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED'
}

export interface User {
  id: number;
  login: string;
  password: string;
  status: UserStatus;
  create: dayjs.Dayjs;
  update?: dayjs.Dayjs;
}

export const userFactory = {
  createUser(input: Pick<User, 'login' | 'password'>, clock: Clock): User {
    return { ...input, id: 0, create: clock.now(), status: UserStatus.ACTIVE };
  }
};
