const MissingParamerror = require("../../utils/errors/missing-param-error");

const makeAuthUseCase = (repository) => {

  class AuthUseCase {

    constructor(repository) {
      this.repository = repository;
    }

    async auth(email, password) {
      if (!email) {
        throw new MissingParamerror('email');
      };

      if (!password) {
        throw new MissingParamerror('password');
      }

      await this.repository.load(email)
    }

  }

  return new AuthUseCase(repository);
}


describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = makeAuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamerror('email'));
  })

  test('should throw if no password is provided', async () => {
    const email = "any_email@email.com";
    const sut = makeAuthUseCase();
    const promise = sut.auth(email);
    expect(promise).rejects.toThrow(new MissingParamerror('password'));
  })

  test('should call loadUserByEmailRepository with correct email', async () => {

    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    class LoadUserByEmailRepository {
      async load(email) {
        this.email = email;
      }
    }

    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const sut = makeAuthUseCase(loadUserByEmailRepository);
    sut.auth(credentials.email, credentials.password);
    expect(loadUserByEmailRepository.email).toBe(credentials.email);
  })
})