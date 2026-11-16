const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Format date and time
function formatDateTime(date) {
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

// Save tasks in local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
// Calculate dashboard statistics
const total = tasks.length;

const completed = tasks.filter(function(task) {
    return task.completed === true;
}).length;

const pending = total - completed;

// Update dashboard numbers
document.getElementById("totalTasks").textContent = total;

document.getElementById("completedTasks").textContent = completed;

document.getElementById("pendingTasks").textContent = pending;
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            task.completedAt = task.completed
                ? new Date().toISOString()
                : null;

            saveTasks();
            displayTasks();
        });

        // Task details
        const details = document.createElement("div");
        details.className = "task-details";

        const taskName = document.createElement("span");
        taskName.textContent = task.text;
        taskName.className = "task-name";

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = task.completed ? "Completed" : "Pending";

        const addedTime = document.createElement("small");
        addedTime.textContent =
            "Added: " + formatDateTime(task.createdAt);

        const completedTime = document.createElement("small");

        if (task.completed) {
            completedTime.textContent =
                "Completed: " + formatDateTime(task.completedAt);
        }

        details.appendChild(taskName);
        details.appendChild(status);
        details.appendChild(addedTime);

        if (task.completed) {
            details.appendChild(completedTime);
        }

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            const updatedText = prompt("Edit your task:", task.text);

            if (updatedText !== null && updatedText.trim() !== "") {
                task.text = updatedText.trim();
                saveTasks();
                displayTasks();
            }
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        const actions = document.createElement("div");
        actions.className = "task-actions";
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

// Add a new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

// Add button event
addTaskBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Display saved tasks when page loads
displayTasks();