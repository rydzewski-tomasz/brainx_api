import { User } from '../domain/user';
import { UserTokens } from '../domain/userTokens';

export type CreateUserTokensUseCase = (user: User) => Promise<UserTokens>;
