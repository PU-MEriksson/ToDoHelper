document.addEventListener("DOMContentLoaded", loadStoredTasks);
document.querySelector("#add-button").addEventListener("click", addTask);

function addTask() {
  const taskInput = document.querySelector("#input-field");
  const alertMessage = document.querySelector("#alert");

  const task = taskInput.value.trim();
  alertMessage.textContent = "";

  if (!task) {
    showAlert("Vänligen skriv in en uppgift.", "error");
    return;
  }

  // Save the task and update UI
  const newTask = { task, steps: [] };
  saveTaskToLocalStorage(newTask);
  renderTasks();
  showAlert("Uppgift tillagd!", "success");

  // Fetch AI-generated steps and update task
  fetchAI(task)
    .then((steps) => {
      updateTaskInLocalStorage(task, steps);
      renderTasks();
    })
    .catch(() => {
      showAlert("Kunde inte hämta steg från AI.", "error");
    });

  taskInput.value = ""; // Clear input field
}

async function fetchAI(task) {
  const response = await fetch("/api/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  const data = await response.json();
  return data.steps || [];
}

function saveTaskToLocalStorage(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(task, steps) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.task === task ? { ...t, steps } : t));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadStoredTasks() {
  renderTasks();
}

function renderTasks() {
  const todoList = document.querySelector("#to-do-items");
  todoList.innerHTML = ""; // Clear existing items

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(({ task, steps }) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.classList.add("to-do-item");
    todoList.appendChild(li);

    // Show AI-generated breakdown (if exists)
    if (steps.length > 0) {
      const sublist = document.createElement("ul");
      sublist.classList.add("sub-tasks");

      steps.forEach((step) => {
        const subLi = document.createElement("li");
        subLi.textContent = step;
        subLi.classList.add("sub-task-item");
        sublist.appendChild(subLi);
      });

      li.appendChild(sublist);
    }
  });
}

// Show alert message
function showAlert(message, type) {
  const alertMessage = document.querySelector("#alert");
  alertMessage.textContent = message;
  //   alertMessage.style.color = type === "success" ? "green" : "red";

  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}
