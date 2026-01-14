const AddReplyUseCase = require("../AddReplyUseCase");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("AddReplyUseCase", () => {
  it("should orchestrate the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      content: "sebuah balasan",
      owner: "user-123",
    };

    const expectedAddedReply = new AddedReply({
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
      Promise.resolve(),
    );
    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(expectedAddedReply),
    );

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith({
      content: "sebuah balasan",
      owner: "user-123",
      commentId: "comment-123",
    });
  });
});
