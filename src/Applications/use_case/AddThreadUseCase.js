const NewThread = require("../../Domains/threads/entities/NewThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseUserId, useCasePayload) {
    // Gabungin payload body dengan owner (userId)
    const newThread = new NewThread({
      ...useCasePayload,
      owner: useCaseUserId,
    });

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
