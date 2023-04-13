const { FORBIDDEN_ERR } = require('./errors');

class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERR;
  }
}

module.exports = ForbiddenErr;
