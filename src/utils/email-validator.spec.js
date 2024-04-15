const validator = require('validator');

const makeSut = () => {
  class EmailValidator {
    isValid(email) {
      return validator.isEmail(email);
    }
  }
  return new EmailValidator();
}

describe('Email Validator', () => {
  test('should return true if validator return true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid_email@email.com');
    expect(isEmailValid).toBeTruthy();
  })

  test('should return true if validator return false', () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid('');
    expect(isEmailValid).toBeFalsy();
  })

  test('should calls validator with correct email', () => {
    const sut = makeSut();
    sut.isValid('valid_email@email.com');
    expect(validator.email).toBe('valid_email@email.com');
  })
})