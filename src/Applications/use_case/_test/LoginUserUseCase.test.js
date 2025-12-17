const LoginUserUseCase = require("../LoginUserUseCase");
const UserLogin = require("../../../Domains/users/entities/UserLogin");
const NewAuth = require("../../../Domains/authentications/entities/NewAuth");
const UserRepository = require("../../../Domains/users/UserRepository");
const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const PasswordHash = require("../../security/PasswordHash");

describe("LoginUserUseCase", () => {
  it("should orchestrate the login user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "secret_password",
    };

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));
    mockPasswordHash.compare = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("user-123"));
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("access_token"));
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("refresh_token"));
    mockAuthenticationRepository.addToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuth = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuth).toStrictEqual(
      new NewAuth({
        accessToken: "access_token",
        refreshToken: "refresh_token",
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(
      "dicoding",
    );
    expect(mockPasswordHash.compare).toHaveBeenCalledWith(
      "secret_password",
      "encrypted_password",
    );
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith("dicoding");
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({ username: "dicoding", id: "user-123" });
    expect(
      mockAuthenticationTokenManager.createRefreshToken,
    ).toHaveBeenCalledWith({ username: "dicoding", id: "user-123" });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
      "refresh_token",
    );
  });
});
