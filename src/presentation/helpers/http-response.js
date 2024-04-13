const MissingParamerror = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-param-error');

module.exports = class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamerror(paramName)
    }
  }

  static serverError() {
    return {
      statusCode: 500
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
