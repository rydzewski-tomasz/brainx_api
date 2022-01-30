import { Task } from '../../domain/task';
import { AppDbClient } from '../../../core/interfaces/db/dbSetup';
import { DbContext } from '../../../core/app/context/appContext';
import dateUtil from '../../../core/utils/dateUtil';

export const TaskTableName = 'task';

export interface TaskRepository {
  findById: (id: number) => Promise<Task | null>;
  insert: (task: Task) => Promise<Task>;
}

export function taskRepositoryFactory(dbClient: AppDbClient, _: DbContext): TaskRepository {
  const db = dbClient.getDb();

  return {
    findById: async (id: number): Promise<Task | null> => {
      const result = await db(TaskTableName).where('id', id).first();
      return result ? parseFromDb(result) : null;
    },
    insert: async (input: Task): Promise<Task> => {
      const result = await db(TaskTableName)
        .insert({
          name: input.name,
          color: input.color,
          description: input.description,
          create: dateUtil.toText(input.create),
          update: input.update && dateUtil.toText(input.update)
        })
        .returning(['id', 'name', 'color', 'description', 'create', 'update']);
      return parseFromDb(result[0]);
    }
  };
}

function parseFromDb(input: any): Task {
  return {
    id: +input.id,
    name: input.name,
    color: input.color,
    description: input.description,
    create: dateUtil.fromDbDate(input.create),
    update: input.update ? dateUtil.fromDbDate(input.update) : undefined
  };
}
