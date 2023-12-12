import { ReSend } from "../../src/utils/resend-req.js";
describe("resend request.", () => {
  function fn1(params) {
    return new Promise((resolve, reject) => {
      return resolve("fn1 resolve.");
    });
  }
  function fn2(params) {
    return new Promise((resolve, reject) => {
      return resolve("fn2 resolve.");
    });
  }
  function fn3(params) {
    return new Promise((resolve, reject) => {
      return reject("fn3 reject.");
    });
  }
  function fn4(params) {
    return new Promise((resolve, reject) => {
      return resolve("fn4 resolve.");
    });
  }

  let result;
  new ReSend([fn1, fn2, fn3, fn4], { tryMaxTimer: 3 })
    .send()
    .then((r) => (result = r));

  test("", () => {
    expect(result).toEqual({
      failed: ["fn3 reject."],
      succeed: ["fn1 resolve.", "fn2 resolve.", "fn4 resolve."],
    });
  });
});
