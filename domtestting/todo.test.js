/**
 * @jest-environment jsdom
 */
const { setupTodo } = require("./todo");

beforeEach(() => {
    document.body.innerHTML = `
    <input id="todo-input" />
    <button id="add-todo">add</button>
    <ul id="todo-list"></ul>
  `;
});

test("adds new task on button click", () => {
    setupTodo();
    const input = document.getElementById("todo-input");
    const btn = document.getElementById("add-todo");
    input.value = "wash dishes";
    btn.click();
    expect(document.getElementById("todo-list").children.length).toBe(1);
});
