import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { MockUsersRepository } from "../../repositories/mocks/MockUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";

type sutTypes = {
  sut: ShowUserProfileUseCase;
  usersRepositorySpy: IUsersRepository;
}

const makeSut = (): sutTypes => {
  const usersRepositorySpy = new MockUsersRepository();
  const sut = new ShowUserProfileUseCase(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy
  }
}

describe("show user profile", () => {
  test("should call ShowUserProfileUseCase with correct data", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const createUserSpy = jest.spyOn(usersRepositorySpy, 'findById');

    const user = await sut.execute("any_id");

    expect(createUserSpy).toHaveBeenCalled();
    expect(user.id).toBeTruthy();
  })

  test("should not be able to find user if id not exists", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    expect(async () => {
      jest.spyOn(usersRepositorySpy, 'findById').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      });

      const user = await sut.execute("any_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })

  test("should return a user on sucess", async () => {
    const { sut } = makeSut();

    const id = "any_id";
    const user = await sut.execute(id);

    expect(user.id).toBeTruthy();
    expect(id).toBe(user.id);
  })

})
