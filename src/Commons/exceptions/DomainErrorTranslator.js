const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada",
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai",
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit",
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang",
  ),
  "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada",
  ),
  "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat thread baru karena tipe data tidak sesuai",
  ),
  "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat detail thread karena properti yang dibutuhkan tidak ada",
  ),
  "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat detail thread karena tipe data tidak sesuai",
  ),
  "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada",
  ),
  "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat komentar baru karena tipe data tidak sesuai",
  ),
  "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada",
  ),
  "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat komentar baru karena tipe data tidak sesuai",
  ),
};

module.exports = DomainErrorTranslator;
