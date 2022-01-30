import { createEmptySuccessResult, Success, Result, createErrorResult } from '../../utils/result';
import { HealthRepository, healthRepositoryFactory } from '../interfaces/db/healthRepository';
import { AppContext } from '../../app/context/appContext';

export enum HealthError {
  DbConnection = 'DbConnection'
}

export type HealthUseCase = () => Promise<Result<Success, HealthError>>;

export function healthUseCaseFactory({ dbClient }: AppContext): HealthUseCase {
  const healthRepository = healthRepositoryFactory(dbClient);
  return healthUseCase({ healthRepository });
}

export function healthUseCase({ healthRepository }: { healthRepository: HealthRepository }): HealthUseCase {
  return async () => {
    if (!(await healthRepository.isDbConnected())) {
      return createErrorResult(HealthError.DbConnection);
    }

    return createEmptySuccessResult();
  };
}
