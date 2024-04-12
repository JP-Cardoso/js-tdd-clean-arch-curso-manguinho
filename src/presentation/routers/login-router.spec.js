/**
 * sut -> system under test
 */

class LoginRouter {

  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400
      }
    }
  }
}

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
  })

})