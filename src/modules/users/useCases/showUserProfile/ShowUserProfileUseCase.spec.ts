import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


describe('How User Profile', () => {
  let usersRepositoryInMemory: InMemoryUsersRepository
  let showUserProfileUseCase: ShowUserProfileUseCase
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to show user profile', async () => {
    const newUser = {
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    }

    await createUserUseCase.execute(newUser)

    const { user } = await authenticateUserUseCase.execute(newUser)

    const response = await showUserProfileUseCase.execute(user.id as string)
  
    expect(response).toHaveProperty('name')
  })
})