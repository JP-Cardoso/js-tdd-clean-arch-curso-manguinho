/**
 * sut -> system under test;
 * 
 * spy -> Mock que captura valores e faz comparações
 * 
 */

const LoginRouter = require('./login-router');
const MissingParamerror = require('../helpers/missing-param-error');
const InvalidParamError = require('../helpers/invalid-param-error');
const UnauthorizedError = require('../helpers/unauthorized-param-error');
const ServerError = require('../helpers/server-param-error');

//factory pattern
//esse cara é um fake
const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return { authUseCaseSpy, sut, emailValidatorSpy };
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {

    isValid(email) {
      return this.isEmailValid;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid token';
  return authUseCaseSpy;
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
}

describe('Login router', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    httpRequest = {
      body: {
        password: '151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamerror('email'));
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    httpRequest = {
      body: {
        email: 'any_email@.com.br'
      }
    }

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamerror('password'));
  })

  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 500 if no httpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: '151851'
      }
    }

    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toEqual(httpRequest.body.email);
    expect(authUseCaseSpy.password).toEqual(httpRequest.body.password);
  })

  test('should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter();

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 500 if no AuthUseCase has no auth method', async () => {

    class AuthUseCaseSpy { };
    const authUseCase = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCase);

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    httpRequest = {
      body: {
        email: 'valid_email@.com.br',
        password: 'valid_151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);

  })

  test('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accessToken = null;

    httpRequest = {
      body: {
        email: 'invalid_email@.com.br',
        password: 'invalid_151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 500 if no AuthUseCase throws', async () => {


    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })


  test('should return 400 if an invalid email is provided ', async () => {
    const { sut, emailValidatorSpy } = makeSut();   
    const httpRequest = {
      body: {
        email: 'invalid_email@hotmail.com',
        password: 'any_151851'
      }
    }
    emailValidatorSpy.isEmailValid = false;

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  })

})