import { createErrorResult, createSuccessResult, Result } from '../../core/utils/result';
import { Task } from '../domain/task';
import { AppContext } from '../../core/app/context/appContext';
import { TaskRepository, taskRepositoryFactory } from '../interfaces/db/taskRepository';

export enum GetTaskErrorType {
  NotFound = 'NotFound'
}

export type GetTaskUseCase = (taskId: number) => Promise<Result<Task, GetTaskErrorType>>;

export function getTaskUseCaseFactory(ctx: AppContext): GetTaskUseCase {
  const taskRepository = taskRepositoryFactory(ctx.dbClient, {});
  return getTaskUseCase({ taskRepository });
}

export function getTaskUseCase({ taskRepository }: { taskRepository: TaskRepository }): GetTaskUseCase {
  return async (taskId) => {
    const result = await taskRepository.findById(taskId);
    return result ? createSuccessResult(result) : createErrorResult(GetTaskErrorType.NotFound);
  };
}
