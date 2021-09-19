import { CreateUserUseCase } from "./CreateUserUseCase";
import { MockUsersRepository } from "../../repositories/mocks/MockUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";

type sutTypes = {
  sut: CreateUserUseCase;
  usersRepositorySpy: IUsersRepository;
}

const makeSut = (): sutTypes => {
  const usersRepositorySpy = new MockUsersRepository();
  const sut = new CreateUserUseCase(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy
  }
}

describe("create user", () => {
  test("should call CreateUserUseCase with correct data", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const createUserSpy = jest.spyOn(usersRepositorySpy, 'create');
    jest.spyOn(usersRepositorySpy, 'findByEmail').mockImplementationOnce(() => {
      return Promise.resolve(undefined);
    });

    const user = await sut.execute({
      email: "any_email",
      name: "any_name",
      password: "any_password"
    });

    expect(createUserSpy).toHaveBeenCalled();
    expect(user.id).toBeTruthy();
  })

  test("should not be able to create user if exists user with same email", async () => {
    const { sut } = makeSut();

    expect(async () => {
      const user = await sut.execute({
        email: "any_email",
        name: "any_name",
        password: "any_password"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })

  test("should throw if UserRepository throws", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    jest.spyOn(usersRepositorySpy, 'create').mockImplementationOnce(() => {
      throw Error();
    });

    expect(async () => {
      const user = await sut.execute({
        email: "any_email",
        name: "any_name",
        password: "any_password"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })

  test("should return a new user on sucess", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    jest.spyOn(usersRepositorySpy, 'findByEmail').mockImplementationOnce(() => {
      return Promise.resolve(undefined);
    });

    const createUserParams = {
      email: "any_email",
      name: "any_name",
      password: "any_password"
    };

    const newUser = await sut.execute(createUserParams);

    expect(newUser.id).toBeTruthy();
    expect(createUserParams.email).toBe(newUser.email);
  })

})
