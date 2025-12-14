const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt", // Wajib login buat posting thread
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadByIdHandler,
  },
];

module.exports = routes;
