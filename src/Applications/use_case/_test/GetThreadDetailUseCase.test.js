const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    // 1. Mock Data Mentah (Output dari Repository)
    // Pura-puranya ini data langsung dari database
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
        is_delete: false, // Case: Normal
      },
      {
        id: "comment-456",
        username: "johndoe",
        date: "2021-08-08T07:26:21.338Z",
        content: "sebuah comment kasar",
        is_delete: true, // Case: Dihapus (Soft Delete)
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    // 1. Pastikan fungsi repository dipanggil dengan parameter yang benar
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );

    //
    expect(detailThread).toMatchObject({
      id: mockThread.id,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
    });

    // Validasi Detail Comments
    expect(detailThread.comments).toHaveLength(2);

    // Cek Komentar 1 (Normal)
    expect(detailThread.comments[0]).toMatchObject(
      new DetailComment(mockComments[0]),
    );

    // Cek Komentar 2 (Deleted)
    expect(detailThread.comments[1]).toMatchObject(
      new DetailComment(mockComments[0]),
    );
  });
});
