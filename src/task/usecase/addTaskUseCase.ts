import { Task, taskFactory } from '../domain/task';
import { AppContext } from '../../core/app/context/appContext';
import { TaskRepository, taskRepositoryFactory } from '../interfaces/db/taskRepository';

export type AddTaskInput = Pick<Task, 'description' | 'name' | 'color'>;
export type AddTaskUseCase = (input: AddTaskInput) => Promise<Task>;

export function addTaskUseCaseFactory(ctx: AppContext): AddTaskUseCase {
  const taskRepository = taskRepositoryFactory(ctx.dbClient, {});
  return addTaskUseCase({ taskRepository });
}

export function addTaskUseCase({ taskRepository }: { taskRepository: TaskRepository }): AddTaskUseCase {
  return async (input: AddTaskInput) => {
    const task = taskFactory.createTask(input);
    return taskRepository.insert(task);
  };
}
