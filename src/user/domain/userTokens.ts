import jwt from 'jsonwebtoken';
import { Clock } from '../../core/utils/clock';
import dayjs from 'dayjs';

export enum UserTokenStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenRegister {
  id: number;
  userId: number;
  status: UserTokenStatus;
  create: dayjs.Dayjs;
  expire: dayjs.Dayjs;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: number;
}

export interface AccessTokenPayload {
  userId: number;
}

export function userTokensFactory(
  config: {
    refreshTokenKey: string;
    accessTokenKey: string;
    refreshTokenLifetimeInM: number;
    accessTokenLifeTimeInM: number;
  },
  clock: Clock
) {
  function generateAccessToken(input: { userId: number }): string {
    const now = clock.now();
    const payload = { userId: input.userId, iat: now.unix(), exp: now.add(config.accessTokenLifeTimeInM, 'minutes').unix() };
    return jwt.sign(payload, config.accessTokenKey, { algorithm: 'HS256' });
  }

  function generateRefreshToken(input: UserTokenRegister): string {
    const payload = {
      tokenId: input.id,
      userId: input.userId,
      iat: input.create.unix(),
      exp: input.expire.unix()
    };
    return jwt.sign(payload, config.refreshTokenKey, { algorithm: 'HS256' });
  }

  function createUserTokenRegister(input: { userId: number }): UserTokenRegister {
    const now = clock.now();

    return {
      id: 0,
      userId: input.userId,
      status: UserTokenStatus.ACTIVE,
      create: now,
      expire: now.add(config.refreshTokenLifetimeInM, 'minutes')
    };
  }

  return {
    generateAccessToken,
    generateRefreshToken,
    createUserTokenRegister
  };
}
