const RefreshAuthenticationUseCase = require("../RefreshAuthenticationUseCase");
const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");

describe("RefreshAuthenticationUseCase", () => {
  it("should throw error if use case payload not contain refresh token", async () => {
    const useCasePayload = {};
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload),
    ).rejects.toThrow(
      "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN",
    );
  });

  it("should throw error if refresh token not string", async () => {
    const useCasePayload = { refreshToken: 1 };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload),
    ).rejects.toThrow(
      "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should orchestrate the refresh authentication action correctly", async () => {
    const useCasePayload = { refreshToken: "some_refresh_token" };
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "dicoding", id: "user-123" }),
      );
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("some_new_access_token"));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const accessToken =
      await refreshAuthenticationUseCase.execute(useCasePayload);

    expect(
      mockAuthenticationTokenManager.verifyRefreshToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({ username: "dicoding", id: "user-123" });
    expect(accessToken).toEqual("some_new_access_token");
  });
});
