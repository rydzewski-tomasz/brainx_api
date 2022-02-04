import { initHttpEnv } from '../../../common/setup/initFullEnv';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import request from '../../../common/utils/request';
import { expectResponse } from '../../../common/assertions/commonAssertions';
import * as updateTaskUseCase from '../../../../src/task/usecase/updateTaskUseCase';
import { UpdateTaskErrorType } from '../../../../src/task/usecase/updateTaskUseCase';
import { createErrorResult, createSuccessResult } from '../../../../src/core/utils/result';
import { HttpErrorType } from '../../../../src/core/app/middleware/errorMiddleware';
import { expectTaskResponse } from '../../../common/assertions/taskAssertions';

describe('Update task http api', () => {
  initHttpEnv();

  const url = '/task';

  it('GIVEN existing task id with valid request body WHEN updateTask THEN return 200 status with updated task', async () => {
    // GIVEN
    const task = taskBuilder().valueOf();
    const requestBody = { name: 'NewName', description: 'NewDescription', color: '#444444' };
    jest.spyOn(updateTaskUseCase, 'updateTaskUseCaseFactory').mockReturnValueOnce(async () => createSuccessResult(task));

    // WHEN
    const response = await request.put(`${url}/${task.id}`, requestBody);

    // THEN
    expectTaskResponse(response).toBeSuccess(200, task);
  });

  it('GIVEN invalid request body WHEN updateTask THEN return 400 status with error body', async () => {
    // GIVEN
    const taskId = 123;
    const requestBody = { name: 'NewName', description: 'NewDescription', color: '#444444', wrong: 'test' };

    // WHEN
    const response = await request.put(`${url}/${taskId}`, requestBody);

    // THEN
    expectResponse(response).toBeError(400, { type: HttpErrorType.RequestFormatError, field: 'wrong' });
  });

  it('GIVEN not existing task id WHEN updateTask THEN return 404 status with error body', async () => {
    // GIVEN
    const notExistingId = 321;
    const requestBody = { name: 'NewName', description: 'NewDescription', color: '#444444' };
    jest.spyOn(updateTaskUseCase, 'updateTaskUseCaseFactory').mockReturnValueOnce(async () => createErrorResult(UpdateTaskErrorType.TaskNotFound));

    // WHEN
    const response = await request.put(`${url}/${notExistingId}`, requestBody);

    // THEN
    expectResponse(response).toBeError(404, { type: UpdateTaskErrorType.TaskNotFound });
  });
});
