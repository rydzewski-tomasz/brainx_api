import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { User, UserStatus } from '../../../src/user/domain/user';

dayjs.extend(utc);

export function sampleUser(): User {
  return {
    id: 123,
    login: 'test_login',
    password: 'testPassword',
    status: UserStatus.ACTIVE,
    create: dayjs.utc('2022-01-03 11:22'),
    update: dayjs.utc('2022-01-04 12:22')
  };
}

export const userBuilder = (object: User = sampleUser()) => {
  return {
    withId: (id: User['id']) => userBuilder({ ...object, id }),
    withLogin: (login: User['login']) => userBuilder({ ...object, login }),
    withPassword: (password: User['password']) => userBuilder({ ...object, password }),
    withStatus: (status: User['status']) => userBuilder({ ...object, status }),
    withCreate: (create: User['create']) => userBuilder({ ...object, create }),
    withUpdate: (update: User['update']) => userBuilder({ ...object, update }),
    valueOf: () => object
  };
};
