import { dbClient, initFullEnv } from '../../common/setup/initEnv';
import { Task, TaskStatus } from '../../../src/task/domain/task';
import { TaskRepository, taskRepositoryFactory } from '../../../src/task/interfaces/db/taskRepository';
import { taskBuilder } from '../../common/builders/taskBuilder';
import request from '../../common/utils/request';
import { expectResponse } from '../../common/assertions/commonAssertions';
import { currentDate } from '../../common/mock/clock.mock';
import { expect } from 'chai';

describe('Remove task component test', () => {
  initFullEnv();

  const url = '/task';
  let task: Task;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const toAdd = taskBuilder().withStatus(TaskStatus.REMOVED).valueOf();
    taskRepository = taskRepositoryFactory(dbClient);
    task = await taskRepository.insert(toAdd);
  });

  it('GIVEN existing task WHEN removeTask THEN return 200 status with task id', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const response = await request.delete(`${url}/${existingTaskId}`);

    // THEN
    expectResponse(response).toBeSuccess(200, { id: existingTaskId });
  });

  it('GIVEN existing task WHEN removeTask THEN change task status to REMOVED', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    await request.delete(`${url}/${existingTaskId}`);

    // THEN
    const onDb = await taskRepository.findById(existingTaskId);
    expect(onDb).to.deep.equal({ ...task, status: TaskStatus.REMOVED, update: currentDate });
  });
});
