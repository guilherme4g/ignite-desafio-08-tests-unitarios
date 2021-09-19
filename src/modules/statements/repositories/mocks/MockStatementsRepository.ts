import { Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "../IStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { MockUsersRepository } from "../../../users/repositories/mocks/MockUsersRepository";

const mockUsersRepository = new MockUsersRepository();
const user = mockUsersRepository.user;

export class MockStatementsRepository implements IStatementsRepository {
  statement: Statement = {
    id: "any_id",
    description: "any_description",
    amount: 0,
    type: OperationType.DEPOSIT,
    user_id: "any_id",
    user: user,
    created_at: new Date(),
    updated_at: new Date(),
  };

  async create(data: ICreateStatementDTO): Promise<Statement> {
    return Promise.resolve(this.statement);
  };
  async findStatementOperation (data: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return Promise.resolve(this.statement);
  };
  async getUserBalance (data: IGetBalanceDTO): Promise<{ balance: number; } | { balance: number; statement: Statement[]; }> {
    return {
      balance: 0,
    }
  };

}
