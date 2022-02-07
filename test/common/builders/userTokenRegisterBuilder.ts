import { UserTokenRegister, UserTokenStatus } from '../../../src/user/domain/userTokens';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function sampleUserTokenRegister(): UserTokenRegister {
  return {
    id: 345,
    userId: 678,
    status: UserTokenStatus.ACTIVE,
    create: dayjs.utc('2022-02-01 22:33'),
    expire: dayjs.utc('2022-02-28 22:33')
  };
}

export const userTokenRegisterBuilder = (object: UserTokenRegister = sampleUserTokenRegister()) => {
  return {
    withId: (id: UserTokenRegister['id']) => userTokenRegisterBuilder({ ...object, id }),
    withUserId: (userId: UserTokenRegister['userId']) => userTokenRegisterBuilder({ ...object, userId }),
    withStatus: (status: UserTokenRegister['status']) => userTokenRegisterBuilder({ ...object, status }),
    withCreate: (create: UserTokenRegister['create']) => userTokenRegisterBuilder({ ...object, create }),
    withExpire: (expire: UserTokenRegister['expire']) => userTokenRegisterBuilder({ ...object, expire }),
    valueOf: () => object
  };
};
