import { HealthRepository } from '../../../../src/core/health/interfaces/db/healthRepository';
import { HealthError, healthUseCase } from '../../../../src/core/health/usecase/healthUseCase';
import { expectResult } from '../../../common/utils/testUtil';
import { Success } from '../../../../src/core/utils/result';

describe('Unit test healthCheckUseCase', () => {
  it('GIVEN all successful checks WHEN healthCheckUseCase THEN return success', async () => {
    // GIVEN
    const healthRepository: HealthRepository = { isDbConnected: async () => true };

    // WHEN
    const result = await healthUseCase({ healthRepository })();

    // THEN
    expectResult(result).toBeSuccess(Success);
  });

  it('GIVEN fail db check WHEN healthCheckUseCase THEN return DbError', async () => {
    // GIVEN
    const healthRepository: HealthRepository = { isDbConnected: async () => false };

    // WHEN
    const result = await healthUseCase({ healthRepository })();

    // THEN
    expectResult(result).toBeError(HealthError.DbConnection);
  });
});
