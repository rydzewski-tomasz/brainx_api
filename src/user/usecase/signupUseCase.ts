import { UserTokens } from '../domain/userTokens';
import { createErrorResult, createSuccessResult, Result } from '../../core/utils/result';
import { UserRepository } from '../interfaces/db/userRepository';
import { userFactory } from '../domain/user';
import { Clock } from '../../core/utils/clock';
import { CreateUserTokensUseCase } from './createUserTokensUseCase';

export enum SignupErrorType {
  EmailAlreadyExists = 'EmailAlreadyExists'
}

export type SignupUseCase = (email: string, password: string) => Promise<Result<UserTokens, SignupErrorType>>;
type SignupUseCaseInput = { userRepository: UserRepository; clock: Clock; createUserTokensUseCase: CreateUserTokensUseCase };

export function signupUseCase({ userRepository, clock, createUserTokensUseCase }: SignupUseCaseInput): SignupUseCase {
  return async (email, password) => {
    if (!!(await userRepository.findByEmail(email))) {
      return createErrorResult(SignupErrorType.EmailAlreadyExists);
    }

    const user = userFactory(clock).createUser({ email, password });
    await userRepository.insert(user);
    const userTokens = await createUserTokensUseCase(user);
    return createSuccessResult(userTokens);
  };
}
