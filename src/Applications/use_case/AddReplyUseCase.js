const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, content, owner } = useCasePayload;

    // Verifikasi thread & comment ada dulu
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const newReply = new NewReply({ content });
    // Inject properti tambahan yg gak ada di payload body
    return this._replyRepository.addReply({ ...newReply, owner, commentId });
  }
}
module.exports = AddReplyUseCase;
