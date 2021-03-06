import dbTestSetup from '../../../common/utils/dbTestSetup';
import { UserRepository, userRepositoryFactory, UserTableName } from '../../../../src/user/interfaces/db/userRepository';
import { Knex } from 'knex/types/index';
import { User } from '../../../../src/user/domain/user';
import { userBuilder } from '../../../common/builders/userBuilder';
import { expect } from 'chai';

describe('userRepository integration test', () => {
  let db: Knex;
  let userRepository: UserRepository;
  let usersOnDb: User[];

  beforeAll(async () => {
    const dbClient = await dbTestSetup.createDb();
    userRepository = userRepositoryFactory(dbClient);
    db = dbClient.getDb();
  });

  beforeEach(async () => {
    const usersToAdd = [
      { ...userBuilder().withId(-1).withEmail('first').withPassword('123').valueOf(), id: undefined },
      { ...userBuilder().withId(-1).withEmail('second').withPassword('456').valueOf(), id: undefined },
      { ...userBuilder().withId(-1).withEmail('third').withPassword('789').valueOf(), id: undefined }
    ];
    const ids = await db(UserTableName).insert(usersToAdd).returning('id');
    usersOnDb = usersToAdd.map((user, index) => ({ ...user, id: +ids[index] }));
  });

  afterEach(async () => {
    await db(UserTableName).delete();
  });

  afterAll(async () => {
    await dbTestSetup.dropDb();
  });

  it('GIVEN not existing id WHEN findById THEN return null', async () => {
    // GIVEN
    const notExistingId = 164;

    // WHEN
    const result = await userRepository.findById(notExistingId);

    // THEN
    expect(result).to.be.null;
  });

  it('GIVEN existing id WHEN findById THEN return user', async () => {
    // GIVEN
    const existingUser = usersOnDb[1];

    // WHEN
    const result = await userRepository.findById(existingUser.id);

    // THEN
    expect(result).to.deep.equal(existingUser);
  });

  it('GIVEN valid user WHEN insert THEN save user on db', async () => {
    // GIVEN
    const user = userBuilder().withEmail('test123').valueOf();

    // WHEN
    const result = await userRepository.insert(user);

    // THEN
    const onDb = await userRepository.findById(result.id);
    expect(onDb).to.deep.equal({ ...user, id: result.id });
  });

  it('GIVEN not existing login WHEN findByLogin THEN return null', async () => {
    // GIVEN
    const notExistingLogin = 'notExisting';

    // WHEN
    const result = await userRepository.findByEmail(notExistingLogin);

    // THEN
    expect(result).to.be.null;
  });

  it('GIVEN existing login WHEN findByLogin THEN return user with that login', async () => {
    // GIVEN
    const user = usersOnDb[2];

    // WHEN
    const result = await userRepository.findByEmail(user.email);

    // THEN
    expect(result).to.deep.equal(user);
  });
});
