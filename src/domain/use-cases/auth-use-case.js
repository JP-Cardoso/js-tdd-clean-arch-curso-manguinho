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

    if (!this.repository) {
      throw new MissingParamerror('loadUserByEmailRepository');
    }

    if (!this.repository.load) {
      throw new InvalidParamError('loadUserByEmailRepository');
    }

    const user = await this.repository.load(email);
    if (!user) {
      return null;
    }
  }

}