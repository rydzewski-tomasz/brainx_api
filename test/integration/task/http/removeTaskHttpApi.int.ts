import { initHttpEnv } from '../../../common/setup/initEnv';
import * as removeTaskUseCase from '../../../../src/task/usecase/removeTaskUseCase';
import { createEmptySuccessResult, createErrorResult } from '../../../../src/core/utils/result';
import request from '../../../common/utils/request';
import { expectResponse } from '../../../common/assertions/commonAssertions';
import { RemoveTaskErrorType } from '../../../../src/task/usecase/removeTaskUseCase';

describe('Remove task http api integration tests', () => {
  initHttpEnv();

  const url = '/task';

  it('GIVEN existing task id WHEN removeTask THEN return 200 with taskId', async () => {
    // GIVEN
    const taskId = 123;
    jest.spyOn(removeTaskUseCase, 'removeTaskUseCaseFactory').mockReturnValueOnce(async () => createEmptySuccessResult());

    // WHEN
    const response = await request.delete(`${url}/${taskId}`);

    // THEN
    expectResponse(response).toBeSuccess(200, { id: taskId });
  });

  it('GIVEN not existing task id WHEN removeTask THEN return 404 with TaskNotFound error', async () => {
    // GIVEN
    const notExistingTaskId = 321;
    jest.spyOn(removeTaskUseCase, 'removeTaskUseCaseFactory').mockReturnValueOnce(async () => createErrorResult(RemoveTaskErrorType.TaskNotFound));

    // WHEN
    const response = await request.delete(`${url}/${notExistingTaskId}`);

    // THEN
    expectResponse(response).toBeError(404, { type: RemoveTaskErrorType.TaskNotFound });
  });
});
