const Joi = require("joi"); // Pastikan import Joi kalau mau payload-nya muncul di docs

const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthenticationHandler,
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
