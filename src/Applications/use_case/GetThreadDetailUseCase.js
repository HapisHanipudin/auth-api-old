const DetailComment = require("../../Domains/comments/entities/DetailComment");
class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments =
      await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = comments.map((comment) => {
      const detailComment = new DetailComment(comment);

      // Filter reply milik comment ini
      detailComment.replies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_delete
            ? "**balasan telah dihapus**"
            : reply.content,
          date: reply.date,
          username: reply.username,
        }));

      return detailComment;
    });

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
