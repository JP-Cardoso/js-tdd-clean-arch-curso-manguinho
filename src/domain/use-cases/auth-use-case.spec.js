const makeAuthUseCase = () => {
  class AuthUseCase {
    async auth(email) {
      if (!email) return new Error();
    }
  }

  return new AuthUseCase();
}


describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = makeAuthUseCase();
    const promise = await sut.auth();
    expect(promise).rejects.toThrow();
  })
})