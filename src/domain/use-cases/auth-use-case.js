const { MissingParamerror, InvalidParamError } = require("../../utils/errors/");

module.exports = class AuthUseCase {

  constructor(repository, encrypter, tokenGenerator) {
    this.repository = repository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamerror('email');
    };

    if (!password) {
      throw new MissingParamerror('password');
    }

    const user = await this.repository.load(email);
    const isValid = user && await this.encrypter.compare(password, user.password);
    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)
      return accessToken;
    }

    return null;
  }

}