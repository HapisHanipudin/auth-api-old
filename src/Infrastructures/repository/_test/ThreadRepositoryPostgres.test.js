const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" }); // Wajib ada user dulu
      const newThread = new NewThread({
        title: "sebuah thread",
        body: "isi body thread",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; // Stub generator ID
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1); // Data harus masuk DB
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "sebuah thread",
          owner: "user-123",
        }),
      );
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("thread-palsu"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should return thread details correctly", async () => {
      // Arrange
      const userPayload = { id: "user-123", username: "dicoding" };
      const threadPayload = {
        id: "thread-123",
        title: "sebuah thread",
        body: "isi body thread",
        date: "2023-01-01T00:00:00.000Z", // Pastikan format String ISO
        owner: "user-123",
      };

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread =
        await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert
      expect(detailThread).toStrictEqual(
        new DetailThread({
          id: "thread-123",
          title: "sebuah thread",
          body: "isi body thread",
          date: "2023-01-01T00:00:00.000Z",
          username: "dicoding", // Username diambil dari hasil JOIN
        }),
      );
    });
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-palsu"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when thread available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      }); // Pastikan thread ada
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-123"),
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
