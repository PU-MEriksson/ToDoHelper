function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  showAlert("Uppgift borttagen!", "success");
}

function init() {
  loadStoredTasks();
  document.querySelector("#add-button").addEventListener("click", addTask);

  document
    .querySelector("#input-field")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission default behavior
        addTask();
      }
    });
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
  todoList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(({ task, steps }, index) => {
    const li = document.createElement("li");
    li.classList.add("to-do-item");

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    // Add checkbox for the task the user input
    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");
    taskCheckbox.addEventListener("change", () => {
      taskText.classList.toggle("completed", taskCheckbox.checked);
    });

    // Add span to main task text only
    const taskText = document.createElement("span");
    taskText.textContent = task;

    taskContainer.appendChild(taskCheckbox);
    taskContainer.appendChild(taskText);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("title", "Ta bort uppgift");
    deleteBtn.addEventListener("click", () => deleteTask(index));

    taskContainer.appendChild(deleteBtn);
    li.appendChild(taskContainer);

    // Show AI generated steps
    if (steps.length > 0) {
      const sublist = document.createElement("ul");
      sublist.classList.add("sub-tasks");

      steps.forEach((step) => {
        const subLi = document.createElement("li");
        subLi.classList.add("sub-task-item");

        // Create checkbox for each step
        const stepCheckbox = document.createElement("input");
        stepCheckbox.type = "checkbox";
        stepCheckbox.classList.add("step-checkbox");

        // Simply set the text content directly on the li element
        subLi.appendChild(stepCheckbox);
        subLi.appendChild(document.createTextNode(step));
        sublist.appendChild(subLi);
      });

      li.appendChild(sublist);
    }

    todoList.appendChild(li);
  });
}

// Function to get step completion status from localstorage
function getStepCompletionStatus(taskIndex, stepIndex) {
  const completedSteps =
    JSON.parse(localStorage.getItem("completedSteps")) || {};
  return completedSteps[`${taskIndex}-${stepIndex}`] || false;
}

// Function to save task to localstorage
function toggleStepCompletion(taskIndex, stepIndex, isChecked) {
  let completedSteps = JSON.parse(localStorage.getItem("completedSteps")) || {};
  completedSteps[`${taskIndex}-${stepIndex}`] = isChecked;
  localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
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
