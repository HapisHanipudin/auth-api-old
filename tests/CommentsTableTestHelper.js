/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "isi komentar",
    date = "2023-01-01T00:00:00.000Z",
    owner = "user-123",
    threadId = "thread-123",
    isDelete = false,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, content, date, owner, threadId, isDelete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE comments CASCADE");
  },
};

module.exports = CommentsTableTestHelper;
