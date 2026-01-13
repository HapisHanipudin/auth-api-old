const Joi = require("joi"); // Pastikan import Joi kalau mau payload-nya muncul di docs

const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
    options: {
      description: "Login user", // Deskripsi endpoint
      notes: "Mengembalikan accessToken dan refreshToken", // Catatan tambahan
      tags: ["api", "auth"], // WAJIB: tags 'api' biar kedetect sama hapi-swagger
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthenticationHandler,
    options: {
      description: "Refresh Token",
      tags: ["api", "auth"],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
    options: {
      description: "Logout user",
      tags: ["api", "auth"],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }),
      },
    },
  },
];

module.exports = routes;
