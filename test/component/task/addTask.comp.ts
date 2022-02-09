import { dbClient, initFullEnv } from '../../common/setup/initFullEnv';
import { AddTaskRequestBody } from '../../../src/task/interfaces/http/taskHandler';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/assertions/commonAssertions';
import { taskRepositoryFactory } from '../../../src/task/interfaces/db/taskRepository';
import { Task } from '../../../src/task/domain/task';
import { expect } from 'chai';

describe('Add task component test', () => {
  initFullEnv();

  const url = '/task';

  it('GIVEN valid body WHEN addTask THEN return 200 status', async () => {
    // GIVEN
    const requestBody: AddTaskRequestBody = { name: 'Test task', description: 'Test task description', color: '#667788' };

    // WHEN
    const response = await request.post(url, requestBody);

    // THEN
    expectResponse(response).toMatchSuccess(201, {
      name: requestBody.name,
      description: requestBody.description,
      color: requestBody.color
    });
  });

  it('GIVEN valid body WHEN addTask THEN save task on db', async () => {
    // GIVEN
    const requestBody: AddTaskRequestBody = { name: 'Test task', description: 'Test task description', color: '#667788' };

    // WHEN
    const { body } = await request.post(url, requestBody);

    // THEN
    const taskId = body.data.id;
    const onDb = (await taskRepositoryFactory(dbClient).findById(taskId)) as Task;
    expect(onDb).to.contain({ name: requestBody.name, description: requestBody.description, color: requestBody.color });
  });
});
