import { UserTokenRegister, UserTokenStatus } from '../../../src/user/domain/userTokens';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const ecdsa256PrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEILLZuG0zf3a2jLa57Fbv9aoOVUKUfmd0nS5b/fUy9T2joAoGCCqGSM49
AwEHoUQDQgAEwXQzWgtj9EMR5t4C9b5m57qlwLSGyU6hVkMGBhWYBwdC7ggud27H
q2ClXu+nKPVnQNSCAOKQnDsp5q8Qbe79dA==
-----END EC PRIVATE KEY-----`;

const ecdsa256PublicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwXQzWgtj9EMR5t4C9b5m57qlwLSG
yU6hVkMGBhWYBwdC7ggud27Hq2ClXu+nKPVnQNSCAOKQnDsp5q8Qbe79dA==
-----END PUBLIC KEY-----`;

export const sampleKeys = {
  ecdsa256PublicKey,
  ecdsa256PrivateKey,
  hmacKey: 'testKey'
};

export function sampleUserTokenRegister(): UserTokenRegister {
  return {
    id: 345,
    userId: 678,
    status: UserTokenStatus.ACTIVE,
    create: dayjs.utc('2022-02-01 22:33'),
    expire: dayjs.utc('2122-02-28 22:33')
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
