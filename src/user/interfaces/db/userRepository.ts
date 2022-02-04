import { User } from '../../domain/user';
import { DbContext } from '../../../core/app/context/appContext';
import dateUtil from '../../../core/utils/dateParser';

export const UserTableName = 'user';
const selectedColumns = ['id', 'login', 'status', 'password', 'create', 'update'];

export interface UserRepository {
  findById: (id: number) => Promise<User | null>;
  insert: (user: User) => Promise<User>;
}

export function userRepositoryFactory(dbContext: DbContext): UserRepository {
  const db = dbContext.getDb();

  return {
    findById: async (id) => {
      const result = await db(UserTableName)
        .select(...selectedColumns)
        .where('id', id)
        .first();
      return result ? parseFromDb(result) : null;
    },
    insert: async (input) => {
      const result = await db(UserTableName)
        .insert({
          login: input.login,
          password: input.password,
          status: input.status,
          create: dateUtil.toText(input.create),
          update: input.update && dateUtil.toText(input.update)
        })
        .returning(selectedColumns);
      return parseFromDb(result[0]);
    }
  };
}

function parseFromDb(input: any): User {
  return {
    id: +input.id,
    login: input.login,
    password: input.password,
    status: input.status,
    create: dateUtil.fromDbDate(input.create),
    update: input.update ? dateUtil.fromDbDate(input.update) : undefined
  };
}
