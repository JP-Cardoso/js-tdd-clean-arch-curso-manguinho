const HttpResponse = require('../helpers/http-response');
const MissingParamerror = require('../helpers/missing-param-error');

module.exports = class LoginRouter {

  constructor(authUseCase) {
    this.authUseCase = authUseCase
  }

  async route(httpRequest) {

    try {
      const { email, password } = httpRequest.body;

      if (!email) return HttpResponse.badRequest(new MissingParamerror('email'));

      // if(!/email/.test(email)) 

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
