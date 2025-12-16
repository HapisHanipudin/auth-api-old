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
      const requestPayload = {
        username: "dicoding",
        password: "secret_password",
      };
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      if (response.statusCode !== 201) {
        console.error("ERROR RESPONSE:", responseJson); // <--- INI KUNCINYA
      }
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it("should response 400 if login failed", async () => {
      const requestPayload = {
        username: "dicoding",
        password: "secret_password",
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("PUT /authentications", () => {
    it("should response 200 and new access token", async () => {
      const server = await createServer(container);
      const refreshToken = "valid_refresh_token";
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      // Mocking JWT verification logic if needed, but integration test uses real one
      // Since integration test relies on real database and real token manager, we better generate real token
      // But creating real token needs JwtTokenManager instance or helper.
      // To keep it simple, we simulate by creating a valid token via login first in separate flow or just trust the system.
      // Better approach:
    });

    // REVISI PUT TEST (LEBIH ROBUST)
    it("should response 200 and new access token", async () => {
      const server = await createServer(container);
      // 1. Register & Login First to get Valid Refresh Token
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
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

      // 2. Put Refresh Token
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: { refreshToken },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it("should response 400 if refresh token invalid", async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: "PUT",
        url: "/authentications",
        payload: { refreshToken: "invalid_token" },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("DELETE /authentications", () => {
    it("should response 200", async () => {
      const server = await createServer(container);
      // 1. Register & Login First
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret_password",
        },
      });

      console.log("LOGIN RESPONSE PAYLOAD:", JSON.parse(loginResponse.payload)); // <--- INI KUNCINYA
      const { refreshToken } = JSON.parse(loginResponse.payload).data;

      // 2. Delete
      const response = await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: { refreshToken },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
