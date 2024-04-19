const UnauthorizedError = require('../errors/unauthorized-param-error');
const ServerError = require('../errors/server-param-error');

module.exports = class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static authorized(accessToken) {
    return {
      statusCode: 200,
      body: accessToken
    }
  }
}
