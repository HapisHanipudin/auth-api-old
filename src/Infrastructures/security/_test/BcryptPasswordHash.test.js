const bcrypt = require("bcrypt");
const BcryptPasswordHash = require("../BcryptPasswordHash");

describe("BcryptPasswordHash", () => {
  describe("hash function", () => {
    it("should encrypt password correctly", async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, "hash");
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash("plain_password");

      // Assert
      expect(typeof encryptedPassword).toEqual("string");
      expect(encryptedPassword).not.toEqual("plain_password");
      expect(spyHash).toHaveBeenCalledWith("plain_password", 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe("compare function", () => {
    it("should return true when password matches", async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = "plain_password";
      const hashedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Action
      const isMatch = await bcryptPasswordHash.compare(
        plainPassword,
        hashedPassword,
      );

      // Assert
      expect(isMatch).toBe(true);
    });

    it("should return error when password does not match", async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = "plain_password";
      const hashedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Action & Assert
      await expect(
        bcryptPasswordHash.compare("wrong_password", hashedPassword),
      ).rejects.toThrow("PASSWORD_HASH.NOT_MATCHED_PASSWORD");
    });
  });
});
