import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "./CreateStatementController"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe("create statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('should be able to create a new deposit type statement', async() => {

        await createUserUseCase.execute({
            name: "user test",
            email: "usertest@email.com",
            password: "1234",
        })

        const authentication = await authenticateUserUseCase.execute({
            email: "usertest@email.com",
            password: "1234"
        })

        const user_id = authentication.user.id as string

        const statement = await createStatementUseCase.execute({
            user_id,
            type: "deposit" as OperationType,
            amount: 0,
            description: "novo depósito"
        })

        expect(statement).toHaveProperty('id')
    })

    it('should be able to create a new withdraw type statement', async() => {

        await createUserUseCase.execute({
            name: "user test",
            email: "usertest@email.com",
            password: "1234",
        })

        const authentication = await authenticateUserUseCase.execute({
            email: "usertest@email.com",
            password: "1234"
        })

        const user_id = authentication.user.id as string

        const deposit = await createStatementUseCase.execute({
            user_id,
            type: "deposit" as OperationType,
            amount: 50,
            description: "novo depósito"
        })

        const withdraw = await createStatementUseCase.execute({
            user_id,
            type: "withdraw" as OperationType,
            amount: 30,
            description: "novo saque"
        })

        expect(withdraw).toHaveProperty('id')
        expect(withdraw.amount).toBe(30)
    })

    it('should not be able to create a new withdraw with insufficient funds', () => {
      expect(async() => {

        await createUserUseCase.execute({
          name: "user test",
          email: "usertest@email.com",
          password: "1234",
      })

      const authentication = await authenticateUserUseCase.execute({
          email: "usertest@email.com",
          password: "1234"
      })

      const user_id = authentication.user.id as string

      await createStatementUseCase.execute({
          user_id,
          type: "withdraw" as OperationType,
          amount: 30,
          description: "novo saque"
      })
      }).rejects.toBeInstanceOf(AppError)
  })
})