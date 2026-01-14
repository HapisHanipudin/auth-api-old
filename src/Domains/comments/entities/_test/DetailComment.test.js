const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
      // username & date hilang
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrow(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123, // salah tipe
      username: "dicoding",
      date: "2021",
      content: "sebuah comment",
      like_count: "0", // salah tipe
      replies: {}, // salah tipe
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrow(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create DetailComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      is_delete: false,
      like_count: 0,
      replies: [],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(payload.like_count);
  });
});
