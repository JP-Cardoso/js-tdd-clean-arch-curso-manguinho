const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");
const AuthUseCase = require('./auth-use-case');

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepository);

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

    const sut = new AuthUseCase();
    const promise = sut.auth(credentials.email, credentials.password);
    expect(promise).rejects.toThrow(new MissingParamerror('loadUserByEmailRepository'));
  })

  test('should throws if LoadUserByEmailRepository has no load method', async () => {

    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    const sut = new AuthUseCase({});
    const promise = sut.auth(credentials.email, credentials.password);
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'));
  })

  test('should return null if loadUserByEmailRepository return null', async () => {

    const credentials = {
      email: "invalid_email@email.com",
      password: "any_password"
    }

    const { sut } = makeSut();
    const accessToken = await sut.auth(credentials.email, credentials.password);
    expect(accessToken).toBeNull();
  })
})