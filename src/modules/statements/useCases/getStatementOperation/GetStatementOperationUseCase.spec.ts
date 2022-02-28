import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "../createStatement/CreateStatementController"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("create statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getStatementOperationUseCase= new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('should be able to get all user balances', async() => {

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

        const statement = await getStatementOperationUseCase.execute({
            statement_id: withdraw.id as string,
            user_id: user_id
        })

        expect(statement.type).toBe("withdraw")
    
    })

})