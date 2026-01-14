const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const ToggleLikeCommentUseCase = require("../../../../Applications/use_case/ToggleLikeCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute(
      credentialId,
      threadId,
      request.payload,
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: credentialId,
    });

    return {
      status: "success",
    };
  }

  async putCommentLikeHandler(request, _h) {
    const toggleLikeCommentUseCase = this._container.getInstance(
      ToggleLikeCommentUseCase.name,
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await toggleLikeCommentUseCase.execute(credentialId, threadId, commentId);

    return {
      status: "success",
    };
  }
}

module.exports = CommentsHandler;
