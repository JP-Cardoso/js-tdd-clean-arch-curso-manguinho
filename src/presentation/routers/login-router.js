const HttpResponse = require('../helpers/http-response');
const {InvalidParamError, MissingParamerror} = require('../errors');
// const MissingParamerror = require('../errors/missing-param-error');

module.exports = class LoginRouter {

  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase,
      this.emailValidator = emailValidator
  }

  async route(httpRequest) {

    try {
      const { email, password } = httpRequest.body;

      if (!email) return HttpResponse.badRequest(new MissingParamerror('email'));

      if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new InvalidParamError('email'));

      if (!password) return HttpResponse.badRequest(new MissingParamerror('password'));

      const accessToken = await this.authUseCase.auth(email, password);

      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      } else {
        return HttpResponse.authorized({ accessToken })
      }
    } catch (err) {
      // console.error('Error ->', err);
      return HttpResponse.serverError();
    }

  }
}
