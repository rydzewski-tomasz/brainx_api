import { initHttpEnv } from '../../common/setup/initFullEnv';
import { sampleTask } from '../../common/builders/taskBuilder';
import * as getTaskUseCase from '../../../src/task/usecase/getTaskUseCase';
import { GetTaskErrorType } from '../../../src/task/usecase/getTaskUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/core/utils/result';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/assertions/commonAssertions';
import { expectTaskResponse } from '../../common/assertions/taskAssertions';

describe('Get task http api integration tests', () => {
  initHttpEnv();

  const url = '/task';

  it('GIVEN existing id WHEN getTask THEN return status 200 with request body', async () => {
    // GIVEN
    const task = sampleTask();
    jest.spyOn(getTaskUseCase, 'getTaskUseCaseFactory').mockReturnValue(async () => createSuccessResult(task));

    // WHEN
    const response = await request.get(`${url}/${task.id}`);

    // THEN
    expectTaskResponse(response).toBeSuccess(200, task);
  });

  it('GIVEN not existing id WHEN getTask THEN return status 404 with NotFound error type', async () => {
    // GIVEN
    const notExistingTaskId = 143;
    jest.spyOn(getTaskUseCase, 'getTaskUseCaseFactory').mockReturnValue(async () => createErrorResult(GetTaskErrorType.TaskNotFound));

    // WHEN
    const response = await request.get(`${url}/${notExistingTaskId}`);

    // THEN
    expectResponse(response).toBeError(404, { type: GetTaskErrorType.TaskNotFound });
  });
});
