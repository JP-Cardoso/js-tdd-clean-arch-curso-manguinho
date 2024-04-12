/**
 * sut -> system under test
 */

class LoginRouter {

  route(httpRequest) {
    if (!httpRequest.body.email) {
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
})