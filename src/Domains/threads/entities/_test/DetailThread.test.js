const DetailThread = require("../DetailThread");

describe("a DetailThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "sebuah thread",
      body: "ini body thread",
    };
    expect(() => new DetailThread(payload)).toThrow(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      title: "sebuah thread",
      body: "ini body thread",
      date: "2024-01-01T00:00:00.000Z",
      username: "user-123",
    };
    expect(() => new DetailThread(payload)).toThrow(
      "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create detailThread object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini body thread",
      date: "2024-01-01T00:00:00.000Z",
      username: "user-123",
    };
    const detailThread = new DetailThread(payload);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });
});
