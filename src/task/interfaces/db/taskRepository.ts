import { Task } from '../../domain/task';
import { DbContext } from '../../../core/app/context/appContext';
import dateUtil from '../../../core/utils/dateParser';

export const TaskTableName = 'task';
const selectedColumns = ['id', 'name', 'color', 'description', 'create', 'update'];

export interface TaskRepository {
  findById: (id: number) => Promise<Task | null>;
  insert: (task: Task) => Promise<Task>;
  update: (task: Task) => Promise<Task>;
}

export function taskRepositoryFactory(dbContext: DbContext): TaskRepository {
  const db = dbContext.getDb();

  return {
    findById: async (id: number): Promise<Task | null> => {
      const result = await db(TaskTableName)
        .select(...selectedColumns)
        .where('id', id)
        .first();
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
        .returning(selectedColumns);
      return parseFromDb(result[0]);
    },
    update: async (input: Task): Promise<Task> => {
      const result = await db(TaskTableName)
        .update({
          name: input.name,
          color: input.color,
          description: input.description,
          update: input.update && dateUtil.toText(input.update)
        })
        .where('id', input.id)
        .returning(selectedColumns);
      const first = result[0];

      if (!first) {
        throw new Error('TaskNotFound');
      }

      return parseFromDb(first);
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
