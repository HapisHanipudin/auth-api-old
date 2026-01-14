const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("DeleteReplyUseCase", () => {
  it("should orchestrate the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
      Promise.resolve(),
    );
    mockReplyRepository.checkAvailabilityReply = jest.fn(() =>
      Promise.resolve(),
    );
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockReplyRepository.checkAvailabilityReply).toHaveBeenCalledWith(
      "reply-123",
    );
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      "reply-123",
      "user-123",
    );
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith("reply-123");
  });
});
