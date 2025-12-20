class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    // Logic sensor pindah ke sini (Domain Logic)
    this.content = is_delete ? "**komentar telah dihapus**" : content;
  }

  _verifyPayload({ id, username, date, content, is_delete }) {
    if (!id || !username || !date || !content) {
      throw new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string" ||
      typeof is_delete !== "boolean" // Pastikan is_delete boolean (opsional, tergantung repository)
    ) {
      throw new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailComment;
