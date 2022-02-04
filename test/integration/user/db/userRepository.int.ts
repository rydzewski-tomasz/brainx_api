import dbTestSetup from '../../../common/utils/dbTestSetup';
import { UserRepository, userRepositoryFactory, UserTableName } from '../../../../src/user/interfaces/db/userRepository';
import { Knex } from 'knex/types/index';
import { User } from '../../../../src/user/domain/user';
import { userBuilder } from '../../../common/builders/userBuilder';

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
      { ...userBuilder().withId(-1).withLogin('first').valueOf(), id: undefined },
      { ...userBuilder().withId(-1).withLogin('second').valueOf(), id: undefined },
      { ...userBuilder().withId(-1).withLogin('third').valueOf(), id: undefined }
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
    expect(result).toBeNull();
  });

  it('GIVEN existing id WHEN findById THEN return user', async () => {
    // GIVEN
    const existingUser = usersOnDb[1];

    // WHEN
    const result = await userRepository.findById(existingUser.id);

    // THEN
    expect(result).toStrictEqual(existingUser);
  });

  it('GIVEN valid user WHEN insert THEN save user on db', async () => {
    // GIVEN
    const user = userBuilder().withLogin('test123').valueOf();

    // WHEN
    const result = await userRepository.insert(user);

    // THEN
    const onDb = await userRepository.findById(result.id);
    expect(onDb).toStrictEqual({ ...user, id: result.id });
  });
});
