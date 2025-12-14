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

    const expectedDetailThread = new DetailThread({
      id: "thread-123",
      title: "sebuah thread",
      body: "isi body thread",
      date: "2023-01-01T00:00:00.000Z",
      username: "dicoding",
    });

    const expectedComments = [
      {
        id: "comment-123",
        username: "dicoding",
        date: "2023-01-01T00:00:00.000Z",
        content: "sebuah comment",
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository, // Inject
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual({
      ...expectedDetailThread,
      comments: expectedComments,
    });
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
  });
});
