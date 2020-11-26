import "babel-polyfill";
const isValidUrl = require("./index").__get__("isValidUrl");

// @ponicode
describe("isValidUrl", () => {
  test("0", () => {
    let result = isValidUrl("https://ponicode.com");
    expect(result).toBe(true);
  });

  test("1", () => {
    let result = isValidUrl("https://ponicode.com?a=1&b=2");
    expect(result).toBe(true);
  });

  test("2", () => {
    let result = isValidUrl("www.ponicode");
    expect(result).toBe(false);
  });

  test("3", () => {
    let result = isValidUrl("Www.PoniCode.com");
    expect(result).toBe(true);
  });
});
