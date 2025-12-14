class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    // 1. Validasi Thread & Comment Ada
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    // 2. Validasi Hak Akses (Owner)
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    // 3. Lakukan Soft Delete
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
