/**
 * sut -> system under test;
 * 
 * spy -> Mock que captura valores e faz comparações
 * 
 */

const LoginRouter = require('./login-router');
const MissingParamerror = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorized-param-error');
const ServerError = require('../helpers/server-param-error');

//factory pattern
//esse cara é um fake
const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  authUseCaseSpy.accessToken = 'valid token';
  const sut = new LoginRouter(authUseCaseSpy);
  return { authUseCaseSpy, sut };
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
}

describe('Login router', () => {
  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut();

    httpRequest = {
      body: {
        password: '151851'
      }
    }

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamerror('email'));
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    httpRequest = {
      body: {
        email: 'any_email@.com.br'
      }
    }

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamerror('password'));
  })

  test('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut();

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: '151851'
      }
    }

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toEqual(httpRequest.body.email);
    expect(authUseCaseSpy.password).toEqual(httpRequest.body.password);
  })

  test('should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter();

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 500 if no AuthUseCase has no auth method', () => {

    class AuthUseCaseSpy { };
    const authUseCase = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCase);

    httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  test('should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    httpRequest = {
      body: {
        email: 'valid_email@.com.br',
        password: 'valid_151851'
      }
    }

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);

  })

  test('should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accessToken = null;

    httpRequest = {
      body: {
        email: 'invalid_email@.com.br',
        password: 'invalid_151851'
      }
    }

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 500 if no AuthUseCase throws', () => {


    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: 'any_email@.com.br',
        password: 'any_151851'
      }
    }

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })
})