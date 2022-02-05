import jwt from 'jsonwebtoken';
import { Clock } from '../../core/utils/clock';

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
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
  function generateAccessToken(data: AccessTokenPayload): string {
    const now = clock.now();
    const payload = { userId: data.userId, iat: now.unix(), exp: now.add(config.accessTokenLifeTimeInM, 'minutes').unix() };
    return jwt.sign(payload, config.accessTokenKey, { algorithm: 'HS256' });
  }

  function generateRefreshToken(data: RefreshTokenPayload): string {
    const now = clock.now();
    const payload = { ...data, iat: now.unix(), exp: now.add(config.refreshTokenLifetimeInM, 'minutes').unix() };
    return jwt.sign(payload, config.refreshTokenKey, { algorithm: 'HS256' });
  }

  return {
    createUserTokens(payload: { userId: number; tokenId: number }): UserTokens {
      return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload)
      };
    }
  };
}
