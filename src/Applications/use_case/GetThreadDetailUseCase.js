const DetailComment = require("../../Domains/comments/entities/DetailComment");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments =
      await this._commentRepository.getCommentsByThreadId(threadId);

    thread.comments = comments.map((comment) => new DetailComment(comment));

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
