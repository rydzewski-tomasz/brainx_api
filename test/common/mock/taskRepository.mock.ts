import { TaskRepository } from '../../../src/task/interfaces/db/taskRepository';

export const taskRepositoryMock: TaskRepository = {
  insert: async (task) => task,
  findById: async () => null,
  update: async (task) => task
};
