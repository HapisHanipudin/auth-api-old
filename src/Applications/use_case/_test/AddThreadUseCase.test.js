const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "sebuah thread",
      body: "isi body thread",
    };
    const mockThreadOwner = "user-123";

    // Output yang diharapkan dari Use Case
    const expectedAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: mockThreadOwner,
    });

    // PERBAIKAN: Objek return dari Mock Repository (dipisah)
    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: mockThreadOwner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread)); // Gunakan mockAddedThread

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      mockThreadOwner,
      useCasePayload,
    );

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: mockThreadOwner,
      }),
    );
  });
});
