import { HealthRepository, healthRepositoryFactory } from '../../../../src/core/health/interfaces/db/healthRepository';
import dbTestSetup from '../../../common/utils/dbTestSetup';

describe('Test healthRepository', () => {
  let healthRepository: HealthRepository;

  beforeEach(async () => {
    const dbClient = await dbTestSetup.createDb();
    healthRepository = healthRepositoryFactory(dbClient, {});
  });

  afterEach(async () => {
    try {
      await dbTestSetup.dropDb();
    } catch (e) {}
  });

  it('GIVEN valid db connection WHEN isDbConnected THEN return true', async () => {
    // GIVEN

    // WHEN
    const result = await healthRepository.isDbConnected();

    // THEN
    expect(result).toBeTruthy();
  });

  it('GIVEN invalid db connection WHEN isDbConnected THEN return false', async () => {
    // GIVEN
    await dbTestSetup.dropDb();

    // WHEN
    const result = await healthRepository.isDbConnected();

    // THEN
    expect(result).toBeFalsy();
  });
});
