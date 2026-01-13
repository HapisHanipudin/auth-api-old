const ToggleLikeCommentUseCase = require("../ToggleLikeCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("ToggleLikeCommentUseCase", () => {
  it("should orchestrate the add like action correctly when like not exists", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    // Simulate like NOT exists (return 0)
    mockCommentRepository.checkLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));
    mockCommentRepository.addLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(
      "user-123",
      "thread-123",
      "comment-123",
    );

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockCommentRepository.checkLikeComment).toHaveBeenCalledWith(
      "user-123",
      "comment-123",
    );
    // Expect ADD like called
    expect(mockCommentRepository.addLikeComment).toHaveBeenCalledWith(
      "user-123",
      "comment-123",
    );
  });

  it("should orchestrate the delete like action correctly when like exists", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    // Simulate like EXISTS (return 1)
    mockCommentRepository.checkLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.deleteLikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(
      "user-123",
      "thread-123",
      "comment-123",
    );

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockCommentRepository.checkLikeComment).toHaveBeenCalledWith(
      "user-123",
      "comment-123",
    );
    // Expect DELETE like called
    expect(mockCommentRepository.deleteLikeComment).toHaveBeenCalledWith(
      "user-123",
      "comment-123",
    );
  });
});
