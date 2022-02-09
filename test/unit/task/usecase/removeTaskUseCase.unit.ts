import { RemoveTaskErrorType, removeTaskUseCase } from '../../../../src/task/usecase/removeTaskUseCase';
import { TaskRepository } from '../../../../src/task/interfaces/db/taskRepository';
import { Task, TaskStatus } from '../../../../src/task/domain/task';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import { expectResult } from '../../../common/assertions/commonAssertions';
import { Success } from '../../../../src/core/utils/result';
import { clockMock, currentDate } from '../../../common/mock/clock.mock';
import { taskRepositoryMock } from '../../../common/mock/taskRepository.mock';
import { expect } from 'chai';

describe('RemoveTaskUseCase unit test', () => {
  let taskRepository: TaskRepository;
  let task: Task;
  let onDb: Task[];

  beforeEach(() => {
    onDb = [];
    task = taskBuilder().withId(123).withStatus(TaskStatus.ACTIVE).valueOf();
    taskRepository = {
      ...taskRepositoryMock,
      findById: async (id) => (task.id === id ? task : null),
      update: async (task) => {
        onDb.push(task);
        return task;
      }
    };
  });

  it('GIVEN not existing task WHEN removeTaskUseCase THEN return TaskNotFound error result', async () => {
    // GIVEN
    const notExistingTaskId = 125;

    // WHEN
    const result = await removeTaskUseCase({ taskRepository, clock: clockMock })(notExistingTaskId);

    // THEN
    expectResult(result).toBeError(RemoveTaskErrorType.TaskNotFound);
  });

  it('GIVEN existing task id WHEN removeTaskUseCase THEN return success result', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const result = await removeTaskUseCase({ taskRepository, clock: clockMock })(existingTaskId);

    // THEN
    expectResult(result).toBeSuccess(Success);
  });

  it('GIVEN existing task id WHEN removeTaskUseCase THEN set REMOVED task status on db', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    await removeTaskUseCase({ taskRepository, clock: clockMock })(existingTaskId);

    // THEN
    expect(onDb).to.deep.equal([{ ...task, status: TaskStatus.REMOVED, update: currentDate }]);
  });
});
