const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const Jwt = require("@hapi/jwt");

describe("/threads/{threadId}/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah komentar",
      };
      const server = await createServer(container);

      // Prerequisites
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const accessToken = Jwt.token.generate(
        { id: "user-123" },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 404 when thread not found", async () => {
      // Arrange
      const requestPayload = { content: "sebuah komentar" };
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const accessToken = Jwt.token.generate(
        { id: "user-123" },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-palsu/comments", // Thread tidak ada
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and success status", async () => {
      // Arrange
      const server = await createServer(container);

      // Prerequisites
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const accessToken = Jwt.token.generate(
        { id: "user-123" },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 403 when deleting other user comment", async () => {
      // Arrange
      const server = await createServer(container);

      // User A (Owner Komentar)
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });

      // User B (Pencuri)
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "pencuri",
      });
      const accessTokenUserB = Jwt.token.generate(
        { id: "user-456" },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",
        headers: { Authorization: `Bearer ${accessTokenUserB}` },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});
