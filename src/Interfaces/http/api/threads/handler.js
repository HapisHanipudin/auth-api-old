const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    // Binding method biar 'this'-nya ga lepas
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    // Ambil userId dari token JWT (Pastikan auth strategy sudah jalan nanti)
    const { id: credentialId } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute(
      credentialId,
      request.payload,
    );

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name,
    );
    const { threadId } = request.params;

    const thread = await getThreadDetailUseCase.execute({ threadId });

    return {
      status: "success",
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
