import { Task, taskFactory } from '../domain/task';
import { AppContext } from '../../core/app/context/appContext';
import { TaskRepository, taskRepositoryFactory } from '../interfaces/db/taskRepository';
import { Clock } from '../../core/utils/clock';

export type AddTaskInput = Pick<Task, 'description' | 'name' | 'color'>;
export type AddTaskUseCase = (input: AddTaskInput) => Promise<Task>;

export function addTaskUseCaseFactory({ dbClient, clock }: AppContext): AddTaskUseCase {
  const taskRepository = taskRepositoryFactory(dbClient);
  return addTaskUseCase({ taskRepository, clock });
}

export function addTaskUseCase({ taskRepository, clock }: { taskRepository: TaskRepository; clock: Clock }): AddTaskUseCase {
  return async (input: AddTaskInput) => {
    const task = taskFactory.createTask(input, clock);
    return taskRepository.insert(task);
  };
}
