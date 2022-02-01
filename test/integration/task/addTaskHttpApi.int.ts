import { initHttpEnv } from '../../common/setup/initFullEnv';
import * as addTaskUseCase from '../../../src/task/usecase/addTaskUseCase';
import { sampleTask } from '../../common/builders/taskBuilder';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/assertions/commonAssertions';
import { HttpErrorType } from '../../../src/core/app/middleware/errorMiddleware';
import { expectTaskResponse } from '../../common/assertions/taskAssertions';

describe('Add task http api integration tests', () => {
  initHttpEnv();

  const url = '/task';
  const task = sampleTask();

  it('GIVEN valid request body WHEN addTask THEN return status 200 with created task', async () => {
    // GIVEN
    const requestBody = { name: task.name, description: task.description, color: task.color };
    jest.spyOn(addTaskUseCase, 'addTaskUseCaseFactory').mockReturnValue(async () => task);

    // WHEN
    const response = await request.post(url, requestBody);

    // THEN
    expectTaskResponse(response).toBeSuccess(201, task);
  });

  it('GIVEN invalid request body WHEN addTask THEN return status 400 with errorMiddleware', async () => {
    // GIVEN
    const requestBody = { name: task.name, description: task.description };

    // WHEN
    const response = await request.post(url, requestBody);

    // THEN
    expectResponse(response).toBeError(400, { type: HttpErrorType.RequestFormatError, field: 'color' });
  });
});
