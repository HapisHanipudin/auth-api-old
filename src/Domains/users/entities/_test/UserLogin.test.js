const UserLogin = require("../UserLogin");

describe("a UserLogin entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      username: "abc",
    };
    expect(() => new UserLogin(payload)).toThrow(
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      username: 123,
      password: "abc",
    };
    expect(() => new UserLogin(payload)).toThrow(
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create userLogin object correctly", () => {
    const payload = {
      username: "dicoding",
      password: "secret_password",
    };
    const userLogin = new UserLogin(payload);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
