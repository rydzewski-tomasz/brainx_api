import { DbContext } from '../../../app/context/appContext';
import { AppDbClient } from '../../../interfaces/db/dbSetup';

export interface HealthRepository {
  isDbConnected: () => Promise<boolean>;
}

export function healthRepositoryFactory(dbClient: AppDbClient, _: DbContext): HealthRepository {
  const { getDb } = dbClient;

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
