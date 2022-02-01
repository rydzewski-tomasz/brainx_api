import { Task, taskModel } from '../domain/task';
import { createErrorResult, createSuccessResult, Result } from '../../core/utils/result';
import { AppContext } from '../../core/app/context/appContext';
import { TaskRepository, taskRepositoryFactory } from '../interfaces/db/taskRepository';
import { Clock } from '../../core/utils/clock';

export enum UpdateTaskErrorType {
  TaskNotFound = 'TaskNotFound'
}

type ToUpdate = Partial<Pick<Task, 'name' | 'color' | 'description'>>;
export type UpdateTaskUseCase = (taskId: number, toUpdate: ToUpdate) => Promise<Result<Task, UpdateTaskErrorType>>;

export function updateTaskUseCaseFactory({ dbClient, clock }: AppContext): UpdateTaskUseCase {
  const taskRepository = taskRepositoryFactory(dbClient);
  return updateTaskUseCase({ taskRepository, clock });
}

export function updateTaskUseCase({ taskRepository, clock }: { taskRepository: TaskRepository; clock: Clock }): UpdateTaskUseCase {
  return async (taskId, toUpdate) => {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      return createErrorResult(UpdateTaskErrorType.TaskNotFound);
    }

    const updatedTask = taskModel(task).set(toUpdate, clock);
    await taskRepository.update(updatedTask);

    return createSuccessResult(updatedTask);
  };
}
