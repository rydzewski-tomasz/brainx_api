import { UserRepository } from '../../../../src/user/interfaces/db/userRepository';
import { sampleUser } from '../../../common/builders/userBuilder';
import { User, UserStatus } from '../../../../src/user/domain/user';
import { SignupErrorType, signupUseCase } from '../../../../src/user/usecase/signupUseCase';
import { expectResult } from '../../../common/assertions/commonAssertions';
import { clockMock } from '../../../common/mock/clock.mock';
import { expect } from 'chai';
import { expectUser } from '../../../common/assertions/userAssertions';

describe('SignupUseCase unit test', () => {
  let userRepository: UserRepository;
  let onDb: User[];

  beforeEach(() => {
    onDb = [];
    userRepository = {
      findById: async () => null,
      findByEmail: async (email) => (email === 'existing@test.com' ? sampleUser() : null),
      insert: async (user) => {
        onDb.push(user);
        return user;
      }
    };
  });

  it('GIVEN existing email WHEN signupUseCase THEN return EmailAlreadyExists', async () => {
    // GIVEN
    const existingEmail = 'existing@test.com';
    const password = 'test@123';

    // WHEN
    const result = await signupUseCase({ userRepository, clock: clockMock })(existingEmail, password);

    // THEN
    expectResult(result).toBeError(SignupErrorType.EmailAlreadyExists);
  });

  it('GIVEN valid email WHEN signupUseCase THEN save new user in db', async () => {
    // GIVEN
    const email = 'test@test.com';
    const password = 'test@123';

    // WHEN
    await signupUseCase({ userRepository, clock: clockMock })(email, password);

    // THEN
    const userOnDb = onDb[0];
    expect(onDb.length).equal(1);
    expectUser(userOnDb).toHasEmail(email).toHasStatus(UserStatus.ACTIVE).toHasPassword(password);
  });

  it.todo('return user');
});
