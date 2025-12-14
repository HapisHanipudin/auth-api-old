class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    return this._threadRepository.getThreadById(threadId);
  }
}

module.exports = GetThreadDetailUseCase;
