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
    if (!user) {
      return null;
    }

    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }

   const accessToken = await this.tokenGenerator.generate(user.id)
   return accessToken;

  }

}