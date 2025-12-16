const PasswordHash = require("../../Applications/security/PasswordHash");

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return await this._bcrypt.hash(password, this._saltRound);
  }

  async compare(password, hashedPassword) {
    const isMatch = await this._bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new Error("PASSWORD_HASH.NOT_MATCHED_PASSWORD");
    }
    return isMatch;
  }
}

module.exports = BcryptPasswordHash;
