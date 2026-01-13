function setupTodo() {
    const input = document.getElementById("todo-input");
    const btn = document.getElementById("add-todo");
    const list = document.getElementById("todo-list");

    btn.addEventListener("click", () => {
        if (input.value.trim() === "") return;
        const li = document.createElement("li");
        li.textContent = input.value;
        list.appendChild(li);
    });
}

module.exports = { setupTodo };
