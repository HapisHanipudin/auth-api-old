const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it("should response 404 when request unregistered route", async () => {
    // Arrange
    const server = await createServer({});
    // Action
    const response = await server.inject({
      method: "GET",
      url: "/unregisteredRoute",
    });
    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it("should handle server error correctly", async () => {
    // Arrange
    const requestPayload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual("error");
    expect(responseJson.message).toEqual("terjadi kegagalan pada server kami");
  });

  it("should handle server error correctly", async () => {
    // Arrange
    const requestPayload = {
      method: "GET",
      url: "/error-test", // Route ngasal
    };
    const server = await createServer({}); // Gak butuh container beneran

    // Nambahin route jebakan yang throw Error biasa (bukan ClientError/DomainError)
    server.route({
      method: "GET",
      path: "/error-test",
      handler: () => {
        throw new Error("ups error server");
      },
    });

    // Action
    const response = await server.inject(requestPayload);

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual("error");
    expect(responseJson.message).toEqual("terjadi kegagalan pada server kami");
  });
});
