const bcrypt = require("bcrypt");
const pool = require("../../database/postgres/pool");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/authentications endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /authentications", () => {
    it("should response 201 and new authentication", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: "secret_password",
      };

      //Hash password sebelum disimpan ke DB test
      const hashedPassword = await bcrypt.hash("secret_password", 10);

      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: hashedPassword, // Gunakan hashed password
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      if (response.statusCode !== 201) {
        console.error(responseJson);
      }
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it("should response 400 if login payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "harus mengirimkan username dan password",
      );
    });

    it("should response 400 if login payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: 123,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "username dan password harus bertipe string",
      );
    });

    it("should response 401 if username not found", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding", // User ini BELUM didaftarkan
        password: "secret_password",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "kredensial yang Anda berikan salah",
      );
    });

    it("should response 401 if password wrong", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: "wrong_password",
      };
      // User didaftarkan dengan password 'secret_password'
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "kredensial yang Anda berikan salah",
      );
    });
  });

  describe("PUT /authentications", () => {
    it("should response 200 and new access token", async () => {
      // Arrange
      const server = await createServer(container);

      // Hash password
      const hashedPassword = await bcrypt.hash("secret_password", 10);

      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: hashedPassword, // Gunakan hashed password
      });
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret_password",
        },
      });
      const { refreshToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it("should response 400 if refresh token not contain needed property", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan token refresh");
    });

    it("should response 400 if refresh token not meet data type specification", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: 123,
      };

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "refresh token harus bertipe string",
      );
    });

    it("should response 400 if refresh token invalid", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: "invalid_refresh_token",
      };

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("refresh token tidak valid");
    });
  });

  describe("DELETE /authentications", () => {
    it("should response 200", async () => {
      // Arrange
      const server = await createServer(container);

      // Hash password
      const hashedPassword = await bcrypt.hash("secret_password", 10);

      // 1. Daftar & Login User dulu
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: hashedPassword, // Gunakan hashed password
      });
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret_password",
        },
      });
      const { refreshToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 400 if refresh token not contain needed property", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan token refresh");
    });

    it("should response 400 if refresh token not meet data type specification", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: 123,
      };

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "refresh token harus bertipe string",
      );
    });

    it("should response 400 if refresh token invalid", async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: "invalid_refresh_token",
      };

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "refresh token tidak ditemukan di database",
      );
    });
  });
});
