import * as healthUseCase from '../../../../src/core/health/usecase/healthUseCase';
import { createEmptySuccessResult, createErrorResult } from '../../../../src/core/utils/result';
import request from '../../../common/utils/request';
import { expectResponse } from '../../../common/utils/testUtil';
import { HealthError } from '../../../../src/core/health/usecase/healthUseCase';
import { initHttpEnv } from '../../../common/setup/initFullEnv';

describe('Test healthCheck http interface', () => {
  initHttpEnv();

  const url = '/health';

  it('GIVEN success result from healthCheckUseCase WHEN healthCheck THEN return success response', async () => {
    // GIVEN
    jest.spyOn(healthUseCase, 'healthUseCaseFactory').mockReturnValue(async () => createEmptySuccessResult());

    // WHEN
    const response = await request.get(url);

    // THEN
    expectResponse(response).toBeSuccess(200);
  });

  it('GIVEN db error from healthCheckUseCase WHEN healthCheck THEN return db error response', async () => {
    // GIVEN
    jest.spyOn(healthUseCase, 'healthUseCaseFactory').mockReturnValue(async () => createErrorResult(HealthError.DbConnection));

    // WHEN
    const response = await request.get(url);

    // THEN
    expectResponse(response).toBeError(503, { type: HealthError.DbConnection });
  });
});
