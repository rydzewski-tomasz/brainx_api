import { TaskRepository } from '../../../../src/task/interfaces/db/taskRepository';
import { UpdateTaskErrorType, updateTaskUseCase } from '../../../../src/task/usecase/updateTaskUseCase';
import { expectResult } from '../../../common/assertions/commonAssertions';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import { Task } from '../../../../src/task/domain/task';
import { clockMock, currentDate } from '../../../common/mock/clock.mock';
import { taskRepositoryMock } from '../../../common/mock/taskRepository.mock';
import { expect } from 'chai';

type ToUpdate = Partial<Pick<Task, 'name' | 'color' | 'description'>>;

describe('UpdateTaskUseCase unit test', () => {
  let task: Task;
  let taskRepository: TaskRepository;
  let toUpdate: ToUpdate;
  let onDb: Task[];

  beforeEach(() => {
    onDb = [];
    task = taskBuilder().withId(123).valueOf();
    toUpdate = { name: 'updated name', description: 'updated description', color: '#333333' };
    taskRepository = {
      ...taskRepositoryMock,
      findById: async (id) => (task.id === id ? task : null),
      update: async (task) => {
        onDb.push(task);
        return task;
      }
    };
  });

  it('GIVEN not existing task WHEN updateTaskUseCase THEN return TaskNotFound error result', async () => {
    // GIVEN
    const notExistingTaskId = 125;

    // WHEN
    const result = await updateTaskUseCase({ taskRepository, clock: clockMock })(notExistingTaskId, toUpdate);

    // THEN
    expectResult(result).toBeError(UpdateTaskErrorType.TaskNotFound);
  });

  it('GIVEN existing task id WHEN updateTaskUseCase THEN return success result with updated task', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const result = await updateTaskUseCase({ taskRepository, clock: clockMock })(existingTaskId, toUpdate);

    // THEN
    expectResult(result).toBeSuccess({ ...task, name: 'updated name', description: 'updated description', color: '#333333', update: currentDate });
  });

  it('GIVEN existing task id WHEN updateTaskUseCase THEN save updated task using repository', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    await updateTaskUseCase({ taskRepository, clock: clockMock })(existingTaskId, toUpdate);

    // THEN
    expect(onDb).to.deep.equal([{ ...task, name: 'updated name', description: 'updated description', color: '#333333', update: currentDate }]);
  });
});
