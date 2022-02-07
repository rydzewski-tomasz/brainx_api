import { userTokensFactory, UserTokenStatus } from '../../../../src/user/domain/userTokens';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Clock } from '../../../../src/core/utils/clock';
import { sampleUserTokenRegister, userTokenRegisterBuilder } from '../../../common/builders/userTokenRegisterBuilder';

dayjs.extend(utc);

describe('UserTokens unit tests', () => {
  const currentDate = dayjs.utc();
  const clockMock: Clock = { now: () => currentDate };
  const payload = { userId: 12345, tokenId: 9876 };
  const config = { refreshTokenKey: 'refreshSecret', accessTokenKey: 'accessSecret', refreshTokenLifetimeInM: 50, accessTokenLifeTimeInM: 5 };

  it('GIVEN payload and secrets WHEN generateAccessToken THEN generate valid access token', async () => {
    // GIVEN

    // WHEN
    const accessToken = userTokensFactory(config, clockMock).generateAccessToken(payload);

    // THEN
    expect(!!jwt.verify(accessToken, config.accessTokenKey)).toBeTruthy();
  });

  it('GIVEN payload and secrets WHEN generateAccessToken THEN return accessToken with valid payload', async () => {
    // GIVEN

    // WHEN
    const accessToken = userTokensFactory(config, clockMock).generateAccessToken(payload);

    // THEN
    const accessTokenPayload = jwt.verify(accessToken, config.accessTokenKey);
    expect(accessTokenPayload).toStrictEqual({
      userId: payload.userId,
      iat: currentDate.unix(),
      exp: currentDate.add(5, 'minutes').unix()
    });
  });

  it('GIVEN payload and secrets WHEN generateAccessToken THEN generate valid access token', async () => {
    // GIVEN
    const userTokenRegister = sampleUserTokenRegister();

    // WHEN
    const refreshToken = userTokensFactory(config, clockMock).generateRefreshToken(userTokenRegister);

    // THEN
    expect(!!jwt.verify(refreshToken, config.refreshTokenKey)).toBeTruthy();
  });

  it('GIVEN payload and secrets WHEN generateRefreshToken THEN return refreshToken with valid payload', async () => {
    // GIVEN
    const userTokenRegister = userTokenRegisterBuilder().withId(123).withUserId(456).withCreate(dayjs.utc('2022-02-01 10:30')).withExpire(dayjs.utc('2022-02-10 11:30')).valueOf();

    // WHEN
    const refreshToken = userTokensFactory(config, clockMock).generateRefreshToken(userTokenRegister);

    // THEN
    const refreshTokenPayload = jwt.verify(refreshToken, config.refreshTokenKey);
    expect(refreshTokenPayload).toStrictEqual({
      tokenId: 123,
      userId: 456,
      iat: dayjs.utc('2022-02-01 10:30').unix(),
      exp: dayjs.utc('2022-02-10 11:30').unix()
    });
  });

  it('GIVEN valid input WHEN createUserTokenRegister THEN return UserTokenRegister with valid body', async () => {
    // GIVEN
    const input = { userId: 555 };

    // WHEN
    const result = userTokensFactory(config, clockMock).createUserTokenRegister(input);

    // THEN
    expect(result).toStrictEqual({
      id: 0,
      userId: 555,
      status: UserTokenStatus.ACTIVE,
      create: currentDate,
      expire: currentDate.add(50, 'minutes')
    });
  });
});
