const NewComment = require("../NewComment");

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {};
    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 12345,
    };
    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create newComment object correctly", () => {
    const payload = {
      content: "sebuah comment",
    };
    const newComment = new NewComment(payload);
    expect(newComment.content).toEqual(payload.content);
  });
});
