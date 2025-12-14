const AddedComment = require("../AddedComment");

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      content: "isi",
    };
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      content: "isi",
      owner: "user",
    };
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create addedComment object correctly", () => {
    const payload = {
      id: "comment-123",
      content: "isi komentar",
      owner: "user-123",
    };
    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
