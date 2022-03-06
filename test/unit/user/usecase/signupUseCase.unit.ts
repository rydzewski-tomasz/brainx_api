import { UserRepository } from '../../../../src/user/interfaces/db/userRepository';
import { SignupErrorType, signupUseCase } from '../../../../src/user/usecase/signupUseCase';
import { expectResult } from '../../../common/assertions/commonAssertions';
import { clockMock } from '../../../common/mock/clock.mock';
import { sampleUser, userBuilder } from '../../../common/builders/userBuilder';
import { expectUser } from '../../../common/assertions/userAssertions';
import { UserStatus } from '../../../../src/user/domain/user';
import { CreateUserTokensUseCase } from '../../../../src/user/usecase/createUserTokensUseCase';
import SpyInstance = jest.SpyInstance;

describe('SignupUseCase unit test', () => {
  const createUserTokensUseCase: CreateUserTokensUseCase = jest.fn();
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = { findByEmail: jest.fn(), findById: jest.fn(), insert: jest.fn() };
  });

  it('GIVEN existing email WHEN signupUseCase THEN return EmailAlreadyExists', async () => {
    // GIVEN
    const existingEmail = 'existing@test.com';
    const password = 'test@123';
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(sampleUser());

    // WHEN
    const result = await signupUseCase({ userRepository, clock: clockMock, createUserTokensUseCase })(existingEmail, password);

    // THEN
    expectResult(result).toBeError(SignupErrorType.EmailAlreadyExists);
  });

  it('GIVEN valid email WHEN signupUseCase THEN save new user in db', async () => {
    // GIVEN
    const email = 'test@test.com';
    const password = 'test@123';
    const insertSpy = jest.spyOn(userRepository, 'insert');
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    // WHEN
    await signupUseCase({ userRepository, clock: clockMock, createUserTokensUseCase })(email, password);

    // THEN
    const userOnDb = extractArgs(insertSpy);
    expectUser(userOnDb).toHasEmail(email).toHasStatus(UserStatus.ACTIVE).toHasPassword(password);
  });

  it('GIVEN valid email WHEN signupUseCase THEN return success result with user tokens', async () => {
    // GIVEN
    const email = 'test@test.com';
    const password = 'test@123';
    const user = userBuilder().withId(12).withEmail(email).valueOf();
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
    jest.spyOn(userRepository, 'insert').mockResolvedValueOnce(user);
    const createUserTokensUseCase: CreateUserTokensUseCase = async () => ({ accessToken: 'sampleAccessToken', refreshToken: 'sampleRefreshToken' });

    // WHEN
    const result = await signupUseCase({ userRepository, clock: clockMock, createUserTokensUseCase })(email, password);

    // THEN
    expectResult(result).toBeSuccess({
      accessToken: 'sampleAccessToken',
      refreshToken: 'sampleRefreshToken'
    });
  });

  function extractArgs(spy: SpyInstance, argIndex: number = 0) {
    return spy.mock.calls[0][argIndex];
  }
});
