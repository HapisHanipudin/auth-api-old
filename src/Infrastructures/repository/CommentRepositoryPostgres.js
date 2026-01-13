const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, newComment) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, userId, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    // REVISI: Pengecekan NotFoundError dihapus karena sudah ditangani checkAvailabilityComment
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini");
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async addLikeComment(userId, commentId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO user_comment_likes VALUES($1, $2, $3)",
      values: [id, userId, commentId],
    };
    await this._pool.query(query);
  }

  async deleteLikeComment(userId, commentId) {
    const query = {
      text: "DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2",
      values: [userId, commentId],
    };
    await this._pool.query(query);
  }

  async checkLikeComment(userId, commentId) {
    const query = {
      text: "SELECT id FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2",
      values: [userId, commentId],
    };
    const result = await this._pool.query(query);
    return result.rowCount; // Mengembalikan 1 (true) kalau ada, 0 (false) kalau ga ada
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete, 
           CAST(COUNT(user_comment_likes.id) AS INTEGER) AS like_count
           FROM comments
           INNER JOIN users ON comments.owner = users.id
           LEFT JOIN user_comment_likes ON comments.id = user_comment_likes.comment_id
           WHERE comments.thread_id = $1
           GROUP BY comments.id, users.username
           ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
