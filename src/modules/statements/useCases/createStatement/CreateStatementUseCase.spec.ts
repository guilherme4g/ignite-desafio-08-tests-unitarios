import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { MockStatementsRepository } from "../../repositories/mocks/MockStatementsRepository";
import { MockUsersRepository } from "../../../users/repositories/mocks/MockUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

type sutTypes = {
  sut: CreateStatementUseCase;
  statementsRepositorySpy: IStatementsRepository;
  usersRepositorySpy: IUsersRepository;
}

const makeSut = (): sutTypes => {
  const statementsRepositorySpy = new MockStatementsRepository();
  const usersRepositorySpy = new MockUsersRepository();
  const sut = new CreateStatementUseCase(usersRepositorySpy, statementsRepositorySpy);

  return {
    sut,
    usersRepositorySpy,
    statementsRepositorySpy
  }
}

describe("create statement", () => {
  test("should call CreateStatementUseCase with correct data", async () => {
    const { sut, statementsRepositorySpy } = makeSut();

    const createStatementSpy = jest.spyOn(statementsRepositorySpy, 'create');

    const statement = await sut.execute({
      user_id: "any_id",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "any_description"
    });

    expect(createStatementSpy).toHaveBeenCalled();
    expect(statement.id).toBeTruthy();
  })

  test("should not be able to create statement if user not exists", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    expect(async () => {

      jest.spyOn(usersRepositorySpy, 'findById').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      });

      const user = await sut.execute({
        user_id: "any_id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "any_description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  test("should not be able to create statement if user not exists", async () => {
    const { sut, statementsRepositorySpy } = makeSut();

    expect(async () => {

      jest.spyOn(statementsRepositorySpy, 'getUserBalance').mockImplementationOnce(() => {
        return Promise.resolve({
          balance: 99
        });
      });

      const user = await sut.execute({
        user_id: "any_id",
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "any_description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })

  test("should return a new statement on sucess", async () => {
    const { sut, statementsRepositorySpy } = makeSut();

    const createStatementParams = {
      user_id: "any_id",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "any_description"
    };

    const newStatement = await sut.execute(createStatementParams);

    expect(newStatement.id).toBeTruthy();
  })

})
