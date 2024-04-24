const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");

module.exports = class AuthUseCase {

  constructor(repository) {
    this.repository = repository;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamerror('email');
    };

    if (!password) {
      throw new MissingParamerror('password');
    }

    const user = await this.repository.load(email);
    if (!user) {
      return null;
    }
    return null;

  }

}