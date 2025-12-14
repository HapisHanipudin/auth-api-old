const NewThread = require("../NewThread");

describe("a NewThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "sebuah thread",
      body: "ini body thread",
    };
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: "sebuah thread",
      body: "ini body thread",
      owner: 123,
    };
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create newThread object correctly", () => {
    const payload = {
      title: "sebuah thread",
      body: "ini body thread",
      owner: "user-123",
    };
    const newThread = new NewThread(payload);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
