class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId) {
    // 1. Cek thread ada gak
    await this._threadRepository.verifyThreadAvailability(threadId);

    // 2. Cek comment ada gak
    await this._commentRepository.checkAvailabilityComment(commentId);

    // 3. Cek user udah like belum
    const isLiked = await this._commentRepository.checkLikeComment(
      userId,
      commentId,
    );

    // 4. Toggle logic
    if (isLiked) {
      await this._commentRepository.deleteLikeComment(userId, commentId);
    } else {
      await this._commentRepository.addLikeComment(userId, commentId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
