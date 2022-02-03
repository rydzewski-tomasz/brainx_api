import { dbClient, initFullEnv } from '../../common/setup/initFullEnv';
import { Task } from '../../../src/task/domain/task';
import { TaskRepository, taskRepositoryFactory } from '../../../src/task/interfaces/db/taskRepository';
import { taskBuilder } from '../../common/builders/taskBuilder';
import request from '../../common/utils/request';
import { expectTaskResponse } from '../../common/assertions/taskAssertions';
import { currentDate } from '../../common/mock/clock.mock';

describe('Update task component test', () => {
  initFullEnv();

  const url = '/task';
  let task: Task;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const toAdd = taskBuilder().withName('task name').withColor('#111111').withDescription('task description').valueOf();
    taskRepository = taskRepositoryFactory(dbClient);
    task = await taskRepository.insert(toAdd);
  });

  it('GIVEN existing task WHEN updateTask THEN return 200 status with updated task', async () => {
    // GIVEN
    const existingTaskId = task.id;
    const requestBody = { name: 'updated name', color: '#222222', description: 'updated description' };

    // WHEN
    const response = await request.put(`${url}/${existingTaskId}`, requestBody);

    // THEN
    expectTaskResponse(response).toBeSuccess(200, { ...task, name: 'updated name', color: '#222222', description: 'updated description', update: currentDate });
  });

  it('GIVEN existing task WHEN updateTask THEN update task on db', async () => {
    // GIVEN
    const existingTaskId = task.id;
    const requestBody = { name: 'updated on db name', color: '#333333', description: 'updated on db description' };

    // WHEN
    await request.put(`${url}/${existingTaskId}`, requestBody);

    // THEN
    const onDb = await taskRepository.findById(existingTaskId);
    expect(onDb).toStrictEqual({ ...task, name: 'updated on db name', color: '#333333', description: 'updated on db description', update: currentDate });
  });
});
