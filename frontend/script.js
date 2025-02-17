function init() {
  loadStoredTasks();
  document.querySelector("#add-button").addEventListener("click", addTask);
}

// Add event listener after export
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function addTask() {
  const taskInput = document.querySelector("#input-field");
  const detailLevel = document.querySelector("#detailed").value;
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

  const detailLevelMap = {
    low: "basic",
    medium: "standard",
    high: "detailed",
  };

  // Fetch AI-generated steps and update task
  fetchAI(task, detailLevelMap[detailLevel])
    .then((steps) => {
      updateTaskInLocalStorage(task, steps);
      renderTasks();
    })
    .catch(() => {
      showAlert("Kunde inte hämta steg från AI.", "error");
    });

  taskInput.value = ""; // Clear input field
}

async function fetchAI(task, detailLevel = "standard") {
  const response = await fetch("/api/tasks/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, detailLevel }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI response");
  }

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
    li.classList.add("to-do-item");

    // Create span for task text
    const taskText = document.createElement("span");
    taskText.textContent = task;
    taskText.classList.add("task-text"); // Add class to task text
    li.appendChild(taskText);

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
