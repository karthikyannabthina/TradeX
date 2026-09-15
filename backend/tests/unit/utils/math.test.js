const { add } = require("../../../src/utils/math");

describe("add()", () => {
  test("should add two numbers", () => {
    const result = add(10, 20);

    expect(result).toBe(30);
  });
});