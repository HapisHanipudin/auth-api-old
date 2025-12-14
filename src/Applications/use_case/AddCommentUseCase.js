const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    // 1. Verifikasi thread ada dulu
    await this._threadRepository.verifyThreadAvailability(threadId);

    // 2. Validasi payload komentar
    const newComment = new NewComment(useCasePayload);

    // 3. Simpan
    return this._commentRepository.addComment(userId, threadId, newComment);
  }
}

module.exports = AddCommentUseCase;
