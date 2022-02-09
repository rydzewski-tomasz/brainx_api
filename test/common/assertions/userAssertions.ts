import { User } from '../../../src/user/domain/user';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

export function expectUser(user: User) {
  return {
    toHasEmail: (email: User['email']) => {
      expect(user.email, `User email should be ${email} but got ${user.email}`).equal(email);
      return expectUser(user);
    },
    toHasStatus: (status: User['status']) => {
      expect(user.status, `User status should be ${status} but got ${user.status}`).equal(status);
      return expectUser(user);
    },
    toHasPassword: (password: User['password']) => {
      expect(bcrypt.compareSync(password, user.password), `Password ${password} is invalid for user`).to.be.true;
      return expectUser(user);
    }
  };
}
