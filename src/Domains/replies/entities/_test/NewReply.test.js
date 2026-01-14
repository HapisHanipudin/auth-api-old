const NewReply = require("../NewReply");

describe("NewReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    const payload = {};
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    const payload = {
      content: 123,
    };
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create newReply object correctly", () => {
    const payload = {
      content: "sebuah balasan",
    };
    const newReply = new NewReply(payload);
    expect(newReply.content).toEqual(payload.content);
  });
});
