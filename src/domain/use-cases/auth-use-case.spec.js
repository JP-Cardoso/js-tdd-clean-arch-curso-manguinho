const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");

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

      if (!this.repository) {
        throw new MissingParamerror('loadUserByEmailRepository');
      }

      if (!this.repository.load) {
        throw new InvalidParamError('loadUserByEmailRepository');
      }

      await this.repository.load(email)
    }

  }

  return new AuthUseCase(repository);
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  const sut = makeAuthUseCase(loadUserByEmailRepository);

  return {
    loadUserByEmailRepository,
    sut
  }
}


describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamerror('email'));
  })

  test('should throw if no password is provided', async () => {
    const email = "any_email@email.com";
    const { sut } = makeSut();
    const promise = sut.auth(email);
    expect(promise).rejects.toThrow(new MissingParamerror('password'));
  })

  test('should call loadUserByEmailRepository with correct email', async () => {
    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    const { sut, loadUserByEmailRepository } = makeSut();

    sut.auth(credentials.email, credentials.password);
    expect(loadUserByEmailRepository.email).toBe(credentials.email);
  })

  test('should throws if no LoadUserByEmailRepository is provided', async () => {

    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    const sut = makeAuthUseCase();
    const promise = sut.auth(credentials.email, credentials.password);
    expect(promise).rejects.toThrow(new MissingParamerror('loadUserByEmailRepository'));
  })

  test('should throws if LoadUserByEmailRepository has no load method', async () => {

    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    const sut = makeAuthUseCase({});
    const promise = sut.auth(credentials.email, credentials.password);
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'));
  })
})