import { User } from "../../entities/User";

import { ICreateUserDTO } from "../../useCases/createUser/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

export class MockUsersRepository implements IUsersRepository {
  user: User = {
    id: "any_id",
    name: "any_name",
    password: "any_password",
    email: "any_email",
    statement: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  async create (data: ICreateUserDTO): Promise<User> {
    return Promise.resolve(this.user);
  };
  async findByEmail (email: string): Promise<User | undefined> {
    return Promise.resolve(this.user);
  };
  async findById (user_id: string): Promise<User | undefined> {
    return Promise.resolve(this.user);
  };
}
