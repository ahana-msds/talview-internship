/**
 * @jest-environment jsdom
 */

const { setupCounter } = require("./counter");

beforeEach(() => {
    document.body.innerHTML = `
    <button id="incBtn">increment</button>
    <span id="count">0</span>
  `;
});

test("counter increments on click", () => {
    setupCounter();

    const btn = document.getElementById("incBtn");
    const count = document.getElementById("count");

    btn.click();

    expect(count.textContent).toBe("1");
});
