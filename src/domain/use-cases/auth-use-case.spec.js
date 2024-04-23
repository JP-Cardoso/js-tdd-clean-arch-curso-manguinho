const MissingParamerror = require("../../utils/errors/missing-param-error");

const makeAuthUseCase = () => {
  class AuthUseCase {
    async auth(email, password) {
      if (!email) {
        throw new MissingParamerror('email');
      };

      if(!password) {
        throw new MissingParamerror('password');
      }
    }
  }

  return new AuthUseCase();
}


describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = makeAuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamerror('email'));
  })

  test('should throw if no password is provided', async () => {
    const email = "any_email@email.com";
    const sut = makeAuthUseCase();
    const promise = sut.auth(email);
    expect(promise).rejects.toThrow(new MissingParamerror('password'));
  })
})