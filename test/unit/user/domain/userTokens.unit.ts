import { userTokensFactory } from '../../../../src/user/domain/userTokens';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Clock } from '../../../../src/core/utils/clock';

dayjs.extend(utc);

describe('UserTokens unit tests', () => {
  const currentDate = dayjs.utc();
  const clockMock: Clock = { now: () => currentDate };
  const payload = { userId: 12345, tokenId: 9876 };
  const config = { refreshTokenKey: 'refreshSecret', accessTokenKey: 'accessSecret', refreshTokenLifetimeInM: 50, accessTokenLifeTimeInM: 5 };

  it('GIVEN payload and secrets WHEN createUserTokens THEN create valid tokens', async () => {
    // GIVEN

    // WHEN
    const tokens = userTokensFactory(config, clockMock).createUserTokens(payload);

    // THEN
    expect({
      isAccessTokenValid: !!jwt.verify(tokens.accessToken, config.accessTokenKey),
      isRefreshTokenValid: !!jwt.verify(tokens.refreshToken, config.refreshTokenKey)
    }).toStrictEqual({
      isAccessTokenValid: true,
      isRefreshTokenValid: true
    });
  });

  it('GIVEN payload and secrets WHEN createUserTokens THEN return refreshToken with valid payload', async () => {
    // GIVEN

    // WHEN
    const tokens = userTokensFactory(config, clockMock).createUserTokens(payload);

    // THEN
    const refreshTokenPayload = jwt.verify(tokens.refreshToken, config.refreshTokenKey);
    expect(refreshTokenPayload).toStrictEqual({
      tokenId: payload.tokenId,
      userId: payload.userId,
      iat: currentDate.unix(),
      exp: currentDate.add(50, 'minutes').unix()
    });
  });

  it('GIVEN payload and secrets WHEN createUserTokens THEN return accessToken with valid payload', async () => {
    // GIVEN

    // WHEN
    const tokens = userTokensFactory(config, clockMock).createUserTokens(payload);

    // THEN
    const accessTokenPayload = jwt.verify(tokens.accessToken, config.accessTokenKey);
    expect(accessTokenPayload).toStrictEqual({
      userId: payload.userId,
      iat: currentDate.unix(),
      exp: currentDate.add(5, 'minutes').unix()
    });
  });
});
