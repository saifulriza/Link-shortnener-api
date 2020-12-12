import "babel-polyfill";
const isValidUrl = require("./index").__get__("isValidUrl");

// @url
describe("isValidUrl", () => {
  test("0", () => {
    let result = isValidUrl("https://url.com");
    expect(result).toBe(true);
  });

  test("1", () => {
    let result = isValidUrl("https://url.com?a=1&b=2");
    expect(result).toBe(true);
  });

  test("2", () => {
    let result = isValidUrl("www.url");
    expect(result).toBe(false);
  });

  test("3", () => {
    let result = isValidUrl("Www.url.com");
    expect(result).toBe(true);
  });

  test("4", () => {
    let result = isValidUrl("url");
    expect(result).toBe(true);
  });
});
