const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
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

  describe("getCommentsByThreadId", () => {
    it("should return comments with correct like count", async () => {
      // Arrange
      // User 1 bikin thread & komen
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
        threadId: "thread-123",
        owner: "user-123",
      });

      // User 2 (johndoe) like komen User 1
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "johndoe",
      });
      await LikesTableTestHelper.addLike("like-1", "user-456", "comment-123");

      // User 1 juga like komen dia sendiri (narsis dikit gapapa)
      await LikesTableTestHelper.addLike("like-2", "user-123", "comment-123");

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments =
        await commentRepositoryPostgres.getCommentsByThreadId("thread-123");

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].like_count).toEqual(2); // Harus 2 like
    });
  });

  describe("addLikeComment", () => {
    it("should add like to database", async () => {
      // Arrange
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
      const fakeIdGenerator = () => "123"; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addLikeComment("user-123", "comment-123");

      // Assert
      const likes = await LikesTableTestHelper.findLike(
        "user-123",
        "comment-123",
      );
      expect(likes).toHaveLength(1);
    });
  });

  describe("deleteLikeComment", () => {
    it("should delete like from database", async () => {
      // Arrange
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
      await LikesTableTestHelper.addLike("like-123", "user-123", "comment-123");
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteLikeComment(
        "user-123",
        "comment-123",
      );

      // Assert
      const likes = await LikesTableTestHelper.findLike(
        "user-123",
        "comment-123",
      );
      expect(likes).toHaveLength(0);
    });
  });

  describe("checkLikeComment", () => {
    it("should return 1 if like exists", async () => {
      // Arrange
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
      await LikesTableTestHelper.addLike("like-123", "user-123", "comment-123");
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.checkLikeComment(
        "user-123",
        "comment-123",
      );

      // Assert
      expect(result).toEqual(1);
    });

    it("should return 0 if like does not exist", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.checkLikeComment(
        "user-123",
        "comment-123",
      );

      // Assert
      expect(result).toEqual(0);
    });
  });
});
