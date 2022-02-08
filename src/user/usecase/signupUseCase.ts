import { UserTokens } from '../domain/userTokens';
import { createErrorResult, Result } from '../../core/utils/result';
import { UserRepository } from '../interfaces/db/userRepository';
import { userFactory } from '../domain/user';
import { Clock } from '../../core/utils/clock';

export enum SignupErrorType {
  EmailAlreadyExists = 'EmailAlreadyExists'
}

export type SignupUseCase = (email: string, password: string) => Promise<Result<UserTokens, SignupErrorType>>;

// @ts-ignore
export function signupUseCase({ userRepository, clock }: { userRepository: UserRepository; clock: Clock }): SignupUseCase {
  // @ts-ignore
  return async (email, password) => {
    if (!!(await userRepository.findByEmail(email))) {
      return createErrorResult(SignupErrorType.EmailAlreadyExists);
    }

    const user = userFactory(clock).createUser({ email, password });
    await userRepository.insert(user);
  };
}
