const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository"); // Tambah import

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const mockThread = {
      id: "thread-123",
      title: "sebuah title",
      body: "sebuah body",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const mockComments = [
      {
        id: "comment-123",
        username: "dicoding",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false, // Kasus normal
      },
      {
        id: "comment-456",
        username: "johndoe",
        date: "2021-08-08T07:26:21.338Z",
        content: "sebuah comment kasar",
        is_delete: true, // Kasus dihapus
      },
    ];

    const expectedDetailThread = {
      ...mockThread,
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
        {
          id: "comment-456",
          username: "johndoe",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**", // Logic Use Case harus mengubah ini
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository, // Inject
    });

    // Action
    const result = await getThreadDetailUseCase.execute(useCasePayload);
    // Assert
    expect(result).toEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
  });
});
