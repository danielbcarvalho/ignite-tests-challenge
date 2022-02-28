import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

describe('Authenticate User', () => {

  let authenticateUserUseCase: AuthenticateUserUseCase
  let userRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })
  it('should be able to authenticate an user', async () => {
    const newUser = {
      name: 'John',
      email: 'john@test.com',
      password: 'password'
    }

    await createUserUseCase.execute(newUser)

    const data = {
      email: 'john@test.com',
      password: 'password'
    }

    const response = await authenticateUserUseCase.execute(data)

    expect(response).toHaveProperty('token')
  })

  it('should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@mail.com',
        password: '1234'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate an user with wrong password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'test@test.com',
        password: '1234',
        name: 'Test User'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '4321'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
