import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let userRepositoryInMemory: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it('should be able to create a new user', async () => {
    const newUser = {
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    }

    const response = await createUserUseCase.execute(newUser)

    expect(response).toHaveProperty('id')
  })

  it('should be not be able to create a new user with existent email', async () => {
    expect(async () => {
      const newUser = {
        name: 'John',
        email: 'john@example.com',
        password: 'password'
      }
  
     await createUserUseCase.execute(newUser)
     await createUserUseCase.execute(newUser)
    }).rejects.toBeInstanceOf(AppError)
  })
})