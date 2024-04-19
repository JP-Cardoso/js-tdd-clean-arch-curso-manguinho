const MissingParamerror = require("../../utils/errors/missing-param-error");

const makeAuthUseCase = () => {
  class AuthUseCase {
    async auth(email) {
      if (!email) {
        throw new MissingParamerror('email')
      };
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
})