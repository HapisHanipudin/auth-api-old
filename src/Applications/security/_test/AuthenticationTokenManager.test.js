const AuthenticationTokenManager = require("../AuthenticationTokenManager");

describe("AuthenticationTokenManager interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(
      authenticationTokenManager.createRefreshToken({}),
    ).rejects.toThrow("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    await expect(
      authenticationTokenManager.createAccessToken({}),
    ).rejects.toThrow("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    await expect(
      authenticationTokenManager.verifyRefreshToken("dummy_token"),
    ).rejects.toThrow("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    await expect(
      authenticationTokenManager.decodePayload("dummy_token"),
    ).rejects.toThrow("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  });
});
