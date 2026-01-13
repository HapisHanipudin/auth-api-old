const ClientError = require("./ClientError");

class AuthenticationError extends ClientError {
  constructor(message, statuscode = 401) {
    super(message, statuscode);
    this.name = "AuthenticationError";
  }
}

module.exports = AuthenticationError;
