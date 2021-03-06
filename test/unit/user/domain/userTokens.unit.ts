import { UserTokensConfig, userTokensFactory, UserTokenStatus } from '../../../../src/user/domain/userTokens';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Clock } from '../../../../src/core/utils/clock';
import { sampleKeys, sampleUserTokenRegister, userTokenRegisterBuilder } from '../../../common/builders/userTokenRegisterBuilder';
import { expect } from 'chai';

dayjs.extend(utc);

describe('UserTokens unit tests', () => {
  const currentDate = dayjs.utc();
  let clockMock: Clock;
  let payload: any;
  let config: UserTokensConfig;

  beforeEach(() => {
    clockMock = { now: () => currentDate };
    payload = { userId: 12345, tokenId: 9876 };
    config = {
      refreshTokenKey: 'refreshSecret',
      accessTokenPublicKey: sampleKeys.ecdsa256PublicKey,
      accessTokenPrivateKey: sampleKeys.ecdsa256PrivateKey,
      refreshTokenLifetimeInM: 50,
      accessTokenLifeTimeInM: 5
    };
  });

  it('GIVEN payload and secrets WHEN generateAccessToken THEN generate valid access token', async () => {
    // GIVEN

    // WHEN
    const accessToken = userTokensFactory(config, clockMock).generateAccessToken(payload);

    // THEN
    expect(!!jwt.verify(accessToken, config.accessTokenPublicKey)).to.be.true;
  });

  it('GIVEN payload and secrets WHEN generateAccessToken THEN return accessToken with valid payload', async () => {
    // GIVEN

    // WHEN
    const accessToken = userTokensFactory(config, clockMock).generateAccessToken(payload);

    // THEN
    const accessTokenPayload = jwt.verify(accessToken, config.accessTokenPublicKey);
    expect(accessTokenPayload).to.be.deep.equal({
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
    expect(!!jwt.verify(refreshToken, config.refreshTokenKey)).to.be.true;
  });

  it('GIVEN payload and secrets WHEN generateRefreshToken THEN return refreshToken with valid payload', async () => {
    // GIVEN
    const userTokenRegister = userTokenRegisterBuilder().withId(123).withUserId(456).withCreate(dayjs.utc('2022-02-01 10:30')).withExpire(dayjs.utc('2122-02-10 11:30')).valueOf();

    // WHEN
    const refreshToken = userTokensFactory(config, clockMock).generateRefreshToken(userTokenRegister);

    // THEN
    const refreshTokenPayload = jwt.verify(refreshToken, config.refreshTokenKey);
    expect(refreshTokenPayload).to.be.deep.equal({
      tokenId: 123,
      userId: 456,
      iat: dayjs.utc('2022-02-01 10:30').unix(),
      exp: dayjs.utc('2122-02-10 11:30').unix()
    });
  });

  it('GIVEN valid input WHEN createUserTokenRegister THEN return UserTokenRegister with valid body', async () => {
    // GIVEN
    const input = { userId: 555 };

    // WHEN
    const result = userTokensFactory(config, clockMock).createUserTokenRegister(input);

    // THEN
    expect(result).to.be.deep.equal({
      id: 0,
      userId: 555,
      status: UserTokenStatus.ACTIVE,
      create: currentDate,
      expire: currentDate.add(50, 'minutes')
    });
  });
});
