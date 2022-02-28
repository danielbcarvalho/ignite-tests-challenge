import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "../createStatement/CreateStatementController"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe('Get Balance', () => {
  let usersRepositoryInMemory: InMemoryUsersRepository
  let statementsRepositoryInMemory: InMemoryStatementsRepository
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase
  let getBalanceUseCase: GetBalanceUseCase
  let createStatementUseCase: CreateStatementUseCase

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
  })

  it('should be able to get user balance', async () => {
    const newUser = {
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    }

    await createUserUseCase.execute(newUser)

    const authentication = await authenticateUserUseCase.execute(newUser)

    const user_id = authentication.user.id as string

    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 50,
      description: "novo depósito"
    })

    await createStatementUseCase.execute({
      user_id,
      type: "withdraw" as OperationType,
      amount: 30,
      description: "novo saque"
    })

    const response = await getBalanceUseCase.execute({ user_id })

    expect(response).toHaveProperty('balance')
    expect(response.balance).toBe(20)
    expect(response.statement.length).toBe(2)
  })
})