import { dbClient, initFullEnv } from '../../common/setup/initEnv';
import { sampleTask } from '../../common/builders/taskBuilder';
import { taskRepositoryFactory } from '../../../src/task/interfaces/db/taskRepository';
import request from '../../common/utils/request';
import { Task } from '../../../src/task/domain/task';
import { expectTaskResponse } from '../../common/assertions/taskAssertions';

describe('Get task component test', () => {
  initFullEnv();

  const url = '/task';
  let task: Task;

  beforeAll(async () => {
    task = await taskRepositoryFactory(dbClient).insert(sampleTask());
  });

  it('GIVEN existing task id WHEN getTask THEN return 200 status with task', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const response = await request.get(`${url}/${existingTaskId}`);

    // THEN
    expectTaskResponse(response).toBeSuccess(200, task);
  });
});
