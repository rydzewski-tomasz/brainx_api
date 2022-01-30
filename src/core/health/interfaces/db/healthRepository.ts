import { DbContext } from '../../../app/context/appContext';

export interface HealthRepository {
  isDbConnected: () => Promise<boolean>;
}

export function healthRepositoryFactory(dbContext: DbContext): HealthRepository {
  const { getDb } = dbContext;

  return {
    isDbConnected: async () => {
      try {
        const result: any = await getDb().raw(`SELECT current_database();`);
        return result?.rows.length === 1;
      } catch (e) {
        return false;
      }
    }
  };
}
