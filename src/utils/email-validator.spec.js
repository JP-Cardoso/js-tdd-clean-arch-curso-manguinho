const validator = require('validator');

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

describe('Email Validator', () => {
  test('should return true if validator return true', () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('valid_email@email.com');
    expect(isEmailValid).toBeTruthy();
  })

  test('should return true if validator return false', () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('');
    expect(isEmailValid).toBeFalsy();
  })
})