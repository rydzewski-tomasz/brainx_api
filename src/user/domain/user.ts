import dayjs from 'dayjs';
import { Clock } from '../../core/utils/clock';
import bcrypt from 'bcryptjs';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED'
}

export interface User {
  id: number;
  email: string;
  password: string;
  status: UserStatus;
  create: dayjs.Dayjs;
  update?: dayjs.Dayjs;
}

export function userFactory(clock: Clock) {
  return {
    createUser(input: Pick<User, 'email' | 'password'>): User {
      return { ...input, id: 0, create: clock.now(), status: UserStatus.ACTIVE, password: bcrypt.hashSync(input.password) };
    }
  };
}
