const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    // 1. Mock Data Mentah (Output dari Repository)
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
        like_count: 0,
      },
      {
        id: "comment-456",
        username: "johndoe",
        date: "2021-08-08T07:26:21.338Z",
        content: "sebuah comment kasar",
        is_delete: true, // Case: Dihapus (Soft Delete)
        like_count: 0,
      },
    ];

    const mockReplies = [
      {
        id: "reply-123",
        content: "sebuah balasan",
        date: "2021-08-08T07:22:33.555Z",
        username: "johndoe",
        comment_id: "comment-123",
        is_delete: false, // Case: Reply Normal
      },
      {
        id: "reply-456",
        content: "balasan kasar",
        date: "2021-08-08T08:00:00.000Z",
        username: "dicoding",
        comment_id: "comment-123",
        is_delete: true, // Case: Reply Dihapus (Soft Delete)
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );

    // 2. Validasi Struktur Thread Utama
    expect(detailThread).toEqual(
      expect.objectContaining({
        id: mockThread.id,
        title: mockThread.title,
        body: mockThread.body,
        date: mockThread.date,
        username: mockThread.username,
      }),
    );

    // 3. Validasi Comments
    expect(detailThread.comments).toHaveLength(2);

    // -- Cek Komentar 1 (Normal + Punya 2 Replies) --
    const firstComment = detailThread.comments[0];
    expect(firstComment.id).toEqual("comment-123");
    expect(firstComment.content).toEqual("sebuah comment"); // Konten asli
    expect(firstComment.replies).toHaveLength(2);

    // -- Cek Replies di Komentar 1 --
    const [reply1, reply2] = firstComment.replies;

    // Reply 1 (Normal)
    expect(reply1.id).toEqual("reply-123");
    expect(reply1.content).toEqual("sebuah balasan"); // Konten asli

    // Reply 2 (Deleted) - HARUS BERUBAH TEXTNYA
    expect(reply2.id).toEqual("reply-456");
    expect(reply2.content).toEqual("**balasan telah dihapus**"); // Logic soft delete reply

    // -- Cek Komentar 2 (Deleted) --
    const secondComment = detailThread.comments[1];
    expect(secondComment.id).toEqual("comment-456");
    expect(secondComment.content).toEqual("**komentar telah dihapus**"); // Logic soft delete comment
    expect(secondComment.replies).toHaveLength(0);
  });
});
