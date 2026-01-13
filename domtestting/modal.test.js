/**
 * @jest-environment jsdom
 */
const { setupModal } = require("./modal");

beforeEach(() => {
    document.body.innerHTML = `
    <div id="modal" class="hidden"></div>
  `;
});

test("toggles modal visibility class", () => {
    setupModal();
    expect(document.getElementById("modal").classList.contains("visible")).toBe(true);
});
