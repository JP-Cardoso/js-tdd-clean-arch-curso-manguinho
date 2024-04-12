module.exports = class MissingParamerror extends Error {
  constructor(paramName) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamerror';
  }
}