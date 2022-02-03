import { createEmptySuccessResult, createErrorResult, Result, Success } from '../../core/utils/result';
import { TaskRepository, taskRepositoryFactory } from '../interfaces/db/taskRepository';
import { AppContext } from '../../core/app/context/appContext';
import { Clock } from '../../core/utils/clock';
import { taskModel } from '../domain/task';

export enum RemoveTaskErrorType {
  TaskNotFound = 'TaskNotFound'
}

export type RemoveTaskUseCase = (id: number) => Promise<Result<Success, RemoveTaskErrorType>>;

export function removeTaskUseCaseFactory({ dbClient, clock }: AppContext): RemoveTaskUseCase {
  const taskRepository = taskRepositoryFactory(dbClient);
  return removeTaskUseCase({ taskRepository, clock });
}

export function removeTaskUseCase({ taskRepository, clock }: { taskRepository: TaskRepository; clock: Clock }): RemoveTaskUseCase {
  return async (taskId) => {
    const found = await taskRepository.findById(taskId);

    if (!!found) {
      const removed = taskModel(found).remove(clock);
      await taskRepository.update(removed);
      return createEmptySuccessResult();
    } else {
      return createErrorResult(RemoveTaskErrorType.TaskNotFound);
    }
  };
}
