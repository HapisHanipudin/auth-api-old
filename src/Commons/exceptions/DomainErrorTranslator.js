const InvariantError = require("./InvariantError");
const AuthenticationError = require("./AuthenticationError");
const NotFoundError = require("./NotFoundError");
const AuthorizationError = require("./AuthorizationError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password",
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus bertipe string",
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus bertipe string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus bertipe string"),
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
  "PASSWORD_HASH.NOT_MATCHED_PASSWORD": new AuthenticationError(
    "password yang Anda masukkan tidak sesuai",
  ),
  "THREAD.NOT_FOUND": new NotFoundError("thread tidak ditemukan"),
  "COMMENT.NOT_FOUND": new NotFoundError("komentar tidak ditemukan"),
  "AUTHENTICATION.INVALID_AUTHENTICATION": new AuthenticationError(
    "autentikasi gagal",
  ),
  "AUTHORIZATION.NOT_AUTHORIZED": new AuthorizationError(
    "anda tidak memiliki akses untuk resource ini",
  ),
};

module.exports = DomainErrorTranslator;
