const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");
const AuthUseCase = require('./auth-use-case');

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashPassword) {
      this.password = password;
      this.hashPassword = hashPassword;
      return this.isValid;
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true; //default
  return encrypterSpy;
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGeneratorSpy = new TokenGenerator();
  tokenGeneratorSpy.accessToken = "any_token";
  return tokenGeneratorSpy;
}

const makeLoadUserRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: "hash_password"
  };
  return loadUserByEmailRepositorySpy;
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepository = makeLoadUserRepositorySpy();
  const tokenGeneratorSpy = makeTokenGenerator();
  const sut = new AuthUseCase(loadUserByEmailRepository, encrypterSpy, tokenGeneratorSpy);
  return {
    loadUserByEmailRepository,
    sut,
    encrypterSpy,
    tokenGeneratorSpy
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

    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
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


  test('should call TokenGenerator with correct userId', async () => {
    const credentials = {
      email: "valid_email@email.com",
      password: "valid_password"
    }

    const { sut, loadUserByEmailRepository, tokenGeneratorSpy } = makeSut();
    await sut.auth(credentials.email, credentials.password);
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepository.user.id);

  })
})