const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const Jwt = require("@hapi/jwt");

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and persisted reply", async () => {
      // Arrange
      const server = await createServer(container);

      // Login & Prep Data
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "dicoding" });
      const accessToken = Jwt.token.generate(
        { id: userId },
        process.env.ACCESS_TOKEN_KEY,
      );
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: userId,
      });

      const payload = { content: "sebuah balasan" };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 404 when thread or comment not found", async () => {
      // Arrange
      const server = await createServer(container);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = Jwt.token.generate(
        { id: userId },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-palsu/comments/comment-palsu/replies",
        payload: { content: "balasan" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 200 and success status", async () => {
      // Arrange
      const server = await createServer(container);

      // Login & Prep Data
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = Jwt.token.generate(
        { id: userId },
        process.env.ACCESS_TOKEN_KEY,
      );
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123/replies/reply-123",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 403 when user is not owner", async () => {
      // Arrange
      const server = await createServer(container);

      // Owner asli
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
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      // Hacker login
      const userId = "user-hacker";
      await UsersTableTestHelper.addUser({ id: userId, username: "hacker" });
      const accessToken = Jwt.token.generate(
        { id: userId },
        process.env.ACCESS_TOKEN_KEY,
      );

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123/replies/reply-123",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});
