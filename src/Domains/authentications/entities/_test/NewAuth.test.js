const NewAuth = require("../NewAuth");

describe("a NewAuth entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      accessToken: "accessToken",
    };
    expect(() => new NewAuth(payload)).toThrow(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      accessToken: "accessToken",
      refreshToken: 123,
    };
    expect(() => new NewAuth(payload)).toThrow(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create newAuth object correctly", () => {
    const payload = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };
    const newAuth = new NewAuth(payload);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
