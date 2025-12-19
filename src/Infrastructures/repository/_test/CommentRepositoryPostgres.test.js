const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const newComment = new NewComment({
        content: "sebuah comment",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        newComment,
      );

      // Assert
      const comment =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comment).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const newComment = new NewComment({
        content: "sebuah comment",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        newComment,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah comment",
          owner: "user-123",
        }),
      );
    });
  });

  describe("checkAvailabilityComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment("comment-123"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when comment available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addComment({ id: "comment-123" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment("comment-123"),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when comment not belong to owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-456"),
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment belong to owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123"),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should soft delete comment from database", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      await CommentsTableTestHelper.addComment({ id: "comment-123" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment("comment-123");

      // Assert
      const comment =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  // [NEW] INI BAGIAN YANG DIMINTA REVIEWER
  describe("getCommentsByThreadId function", () => {
    it("should return comments correctly", async () => {
      // Arrange
      const userPayload = { id: "user-123", username: "dicoding" };
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userPayload.id,
      });

      // Komentar 1 (Normal)
      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        content: "komentar pertama",
        threadId,
        owner: userPayload.id,
        date: "2023-01-01T00:00:00.000Z",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        content: "komentar kedua",
        threadId,
        owner: userPayload.id,
        date: "2023-01-02T00:00:00.000Z",
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments =
        await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[0].id).toEqual("comment-1");
      expect(comments[0].username).toEqual("dicoding");
      expect(comments[0].content).toEqual("komentar pertama");
      expect(comments[0].date).toBeDefined();

      // Cek data kedua (yang dihapus)
      expect(comments[1].id).toEqual("comment-2");
      expect(comments[1].is_delete).toEqual(true); // Cek status delete
      expect(comments[1].content).toEqual("komentar kedua");
    });
  });
});
