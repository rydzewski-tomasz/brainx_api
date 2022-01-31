import { TaskRepository } from '../../../../src/task/interfaces/db/taskRepository';
import { UpdateTaskErrorType, updateTaskUseCase } from '../../../../src/task/usecase/updateTaskUseCase';
import { expectResult } from '../../../common/utils/testUtil';
import { taskBuilder } from '../../../common/builders/taskBuilder';
import { Clock } from '../../../../src/core/utils/clock';
import dayjs from 'dayjs';
import { Task } from '../../../../src/task/domain/task';

type ToUpdate = Partial<Pick<Task, 'name' | 'color' | 'description'>>;

describe('UpdateTaskUseCase unit test', () => {
  let currentDate: dayjs.Dayjs;
  let clock: Clock;
  let task: Task;
  let taskRepository: TaskRepository;
  let toUpdate: ToUpdate;
  let onDb: Task[];

  beforeEach(() => {
    currentDate = dayjs.utc('2022-01-31 22:00');
    clock = { now: () => currentDate };
    onDb = [];
    task = taskBuilder().withId(123).valueOf();
    toUpdate = { name: 'updated name', description: 'updated description', color: '#333333' };
    taskRepository = {
      insert: async (task) => task,
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
    const result = await updateTaskUseCase({ taskRepository, clock })(notExistingTaskId, toUpdate);

    // THEN
    expectResult(result).toBeError(UpdateTaskErrorType.TaskNotFound);
  });

  it('GIVEN existing task id WHEN updateTaskUseCase THEN return success result with updated task', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    const result = await updateTaskUseCase({ taskRepository, clock })(existingTaskId, toUpdate);

    // THEN
    expectResult(result).toBeSuccess({ ...task, name: 'updated name', description: 'updated description', color: '#333333', update: currentDate });
  });

  it('GIVEN existing task id WHEN updateTaskUseCase THEN save updated task using repository', async () => {
    // GIVEN
    const existingTaskId = task.id;

    // WHEN
    await updateTaskUseCase({ taskRepository, clock })(existingTaskId, toUpdate);

    // THEN
    expect(onDb).toStrictEqual([{ ...task, name: 'updated name', description: 'updated description', color: '#333333', update: currentDate }]);
  });
});
