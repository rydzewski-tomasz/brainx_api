import { initHttpEnv } from '../../common/setup/initFullEnv';
import { sampleTask } from '../../common/builders/taskBuilder';
import * as getTaskUseCase from '../../../src/task/usecase/getTaskUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/core/utils/result';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/utils/testUtil';
import dateUtil from '../../../src/core/utils/dateParser';
import { GetTaskErrorType } from '../../../src/task/usecase/getTaskUseCase';

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
    const expectedResponseBody = { ...task, create: dateUtil.toText(task.create), update: task.update && dateUtil.toText(task.update) };
    expectResponse(response).toBeSuccess(200, expectedResponseBody);
  });

  it('GIVEN not existing id WHEN getTask THEN return status 404 with NotFound error type', async () => {
    // GIVEN
    const notExistingTaskId = 143;
    jest.spyOn(getTaskUseCase, 'getTaskUseCaseFactory').mockReturnValue(async () => createErrorResult(GetTaskErrorType.NotFound));

    // WHEN
    const response = await request.get(`${url}/${notExistingTaskId}`);

    // THEN
    expectResponse(response).toBeError(404, { type: 'NotFound' });
  });
});
