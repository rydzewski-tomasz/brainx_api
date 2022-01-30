import { dbClient, initFullEnv } from '../../common/setup/initFullEnv';
import { sampleTask } from '../../common/builders/taskBuilder';
import { taskRepositoryFactory } from '../../../src/task/interfaces/db/taskRepository';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/utils/testUtil';
import dateUtil from '../../../src/core/utils/dateUtil';
import { Task } from '../../../src/task/domain/task';

describe('Get task component test', () => {
  initFullEnv();

  const url = '/task';
  let task: Task;

  beforeAll(async () => {
    task = await taskRepositoryFactory(dbClient, {}).insert(sampleTask());
  });

  it('GIVEN existing task id WHEN getTask THEN return 200 status with task', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const response = await request.get(`${url}/${existingTaskId}`);

    // THEN
    const expectedResponseBody = { ...task, create: dateUtil.toText(task.create), update: task.update && dateUtil.toText(task.update) };
    expectResponse(response).toBeSuccess(200, expectedResponseBody);
  });
});
