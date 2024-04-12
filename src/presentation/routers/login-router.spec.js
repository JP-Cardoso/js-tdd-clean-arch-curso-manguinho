/**
 * sut -> system under test
 */

const LoginRouter = require('./login-router');
const MissingParamerror = require('../helpers/missing-param-error');

describe('Login router', () => {
  test('should return 400 if no email is provided', () => {
    const sut = new LoginRouter();

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
    const sut = new LoginRouter();

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
    const sut = new LoginRouter();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  })

  test('should return 500 if no httpRequest has no body', () => {
    const sut = new LoginRouter();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  })

})