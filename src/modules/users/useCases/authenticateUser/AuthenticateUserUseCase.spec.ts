import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { MockUsersRepository } from "../../repositories/mocks/MockUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

type sutTypes = {
  sut: AuthenticateUserUseCase;
  usersRepositorySpy: IUsersRepository;
}

const makeSut = (): sutTypes => {
  const usersRepositorySpy = new MockUsersRepository();
  const sut = new AuthenticateUserUseCase(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy
  }
}

describe("authenticate user", () => {
  test("should call AuthenticateUserUseCase with correct data", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const findUserByEmailSpy = jest.spyOn(usersRepositorySpy, 'findByEmail');

    const userAuthenticated = await sut.execute({
      email: "any_email",
      password: "any_password"
    });

    expect(findUserByEmailSpy).toHaveBeenCalled();
    expect(userAuthenticated.token).toBeTruthy();
  })

  test("should not be able to authenticate user if user not exists", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    expect(async () => {
      jest.spyOn(usersRepositorySpy, 'findByEmail').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      });

      const user = await sut.execute({
        email: "any_email",
        password: "any_password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  test("should not be able to authenticate user if password not match", async () => {
    const { sut } = makeSut();

    expect(async () => {

      const user = await sut.execute({
        email: "any_email",
        password: "other_password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  test("should return authenticate user on sucess", async () => {
    const { sut } = makeSut();

    const userParams = {
      email: "any_email",
      password: "any_password"
    };

    const userAuthenticated = await sut.execute(userParams);

    expect(userAuthenticated.token).toBeTruthy();
    expect(userParams.email).toBe(userAuthenticated.user.email);
  })

})
