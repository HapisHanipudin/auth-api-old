const DetailThread = require("../DetailThread");

describe("a DetailThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "thread-123",
    };
    expect(() => new DetailThread(payload)).toThrow(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      title: "title",
      body: "body",
      date: "date",
      username: "dicoding",
    };
    expect(() => new DetailThread(payload)).toThrow(
      "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create detailThread object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "isi body",
      date: "2023-01-01",
      username: "dicoding",
    };
    const detailThread = new DetailThread(payload);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });
});
