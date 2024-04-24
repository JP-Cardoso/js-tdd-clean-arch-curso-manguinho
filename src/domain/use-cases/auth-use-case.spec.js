const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");
const AuthUseCase = require('./auth-use-case');

const makeSut = () => {

  class EncrypterSpy {
    async compare(password, hashPassword) {
      this.password = password;
      this.hashPassword = hashPassword
    }
  }

  const encrypterSpy = new EncrypterSpy()

  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepository.user = {
    password: "hash_password"
  };
  const sut = new AuthUseCase(loadUserByEmailRepository, encrypterSpy);

  return {
    loadUserByEmailRepository,
    sut,
    encrypterSpy
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
    expect(promise).rejects.toThrow();
  })

  test('should throws if LoadUserByEmailRepository has no load method', async () => {

    const credentials = {
      email: "any_email@email.com",
      password: "any_password"
    }

    const sut = new AuthUseCase({});
    const promise = sut.auth(credentials.email, credentials.password);
    expect(promise).rejects.toThrow();
  })

  test('should return null if in invalid email is provided', async () => {

    const credentials = {
      email: "invalid_email@email.com",
      password: "any_password"
    }

    const { sut, loadUserByEmailRepository } = makeSut();
    loadUserByEmailRepository.user = null
    const accessToken = await sut.auth(credentials.email, credentials.password);
    expect(accessToken).toBeNull();
  })

  test('should return null if in invalid password is provided', async () => {

    const credentials = {
      email: "valid_email@email.com",
      password: "invalid_password"
    }

    const { sut } = makeSut();
    const accessToken = await sut.auth(credentials.email, credentials.password);
    expect(accessToken).toBeNull();
  })

  test('should call Encrypter with correct valus', async () => {
    const credentials = {
      email: "valid_email@email.com",
      password: "any_password"
    }

    const { sut, loadUserByEmailRepository, encrypterSpy } = makeSut();
    const accessToken = await sut.auth(credentials.email, credentials.password);
    expect(encrypterSpy.password).toBe(credentials.password);
    expect(encrypterSpy.hashPassword).toBe(loadUserByEmailRepository.user.password);

  })
})