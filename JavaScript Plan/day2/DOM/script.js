// selecting DOM elements
const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// add task on button click
button.addEventListener("click", addTask);

function addTask() {
    let taskText = input.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    // create new list item
    let li = document.createElement("li");
    li.innerText = taskText;

    // mark done on click
    li.addEventListener("click", function () {
        li.classList.toggle("done");
    });

    // add to list
    list.appendChild(li);

    // clear input
    input.value = "";
}
