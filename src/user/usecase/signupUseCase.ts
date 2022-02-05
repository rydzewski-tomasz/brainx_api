import { UserTokens } from '../domain/userTokens';
import { Result } from '../../core/utils/result';

export enum SignupErrorType {}
export type SignupUseCase = (login: string, password: string) => Promise<Result<UserTokens>>;
