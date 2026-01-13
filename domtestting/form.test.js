/**
 * @jest-environment jsdom
 */
const { setupForm } = require("./form");

beforeEach(() => {
    document.body.innerHTML = `
    <form id="login-form">
      <input id="username" />
      <input id="password" />
      <button type="submit">login</button>
    </form>
  `;
});

test("sets form status invalid when empty inputs", () => {
    setupForm();
    document.getElementById("login-form").dispatchEvent(new Event("submit"));
    expect(document.getElementById("login-form").getAttribute("data-status")).toBe("invalid");
});
