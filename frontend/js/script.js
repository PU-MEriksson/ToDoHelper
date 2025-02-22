function saveCollapseState(taskId, isCollapsed) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  collapseStates[taskId] = isCollapsed;
  localStorage.setItem("collapseStates", JSON.stringify(collapseStates));
}

function getCollapseState(taskId) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  return collapseStates[taskId] !== undefined ? collapseStates[taskId] : true;
}

function saveTaskCheckboxState(task, isChecked) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  checkboxStates[task] = isChecked;
  localStorage.setItem("taskCheckboxStates", JSON.stringify(checkboxStates));
}

function getTaskCheckboxState(task) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  return checkboxStates[task] || false;
}

function saveStepCheckboxState(taskId, stepIndex, isChecked) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  if (!stepStates[taskId]) {
    stepStates[taskId] = {};
  }
  stepStates[taskId][stepIndex] = isChecked;
  localStorage.setItem("stepCheckboxStates", JSON.stringify(stepStates));
}

function getStepCheckboxState(taskId, stepIndex) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  return stepStates[taskId]?.[stepIndex] || false;
}

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
        event.preventDefault();
        addTask();
      }
    });
}

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

  taskInput.value = "";
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
  tasks.unshift(taskObj);
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

    // Add checkbox for the task with saved state
    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");

    // Get and set the saved checkbox state
    const isChecked = getTaskCheckboxState(task);
    taskCheckbox.checked = isChecked;

    // Add span for task text with saved completed state
    const taskText = document.createElement("span");
    taskText.textContent = task;
    if (isChecked) {
      taskText.classList.add("completed");
    }

    // Update checkbox change listener to save state
    taskCheckbox.addEventListener("change", () => {
      taskText.classList.toggle("completed", taskCheckbox.checked);
      saveTaskCheckboxState(task, taskCheckbox.checked);
    });

    // Create controls container
    const controlsContainer = document.createElement("div");
    controlsContainer.classList.add("controls-container");

    // Get the saved collapse state for this task
    const isExpanded = getCollapseState(task);

    // Always add collapse button since every task has steps
    const collapseBtn = document.createElement("button");
    collapseBtn.innerHTML = isExpanded ? "▼" : "▶";
    collapseBtn.classList.add("collapse-btn");
    collapseBtn.setAttribute("title", "Expandera/Minimera");

    // Add click handler for collapse
    collapseBtn.addEventListener("click", () => {
      const sublist = li.querySelector(".sub-tasks");
      const isCollapsed = sublist.style.display === "none";
      sublist.style.display = isCollapsed ? "block" : "none";
      collapseBtn.innerHTML = isCollapsed ? "▼" : "▶";
      saveCollapseState(task, isCollapsed);
    });

    controlsContainer.appendChild(collapseBtn);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("title", "Ta bort uppgift");
    deleteBtn.addEventListener("click", () => {
      // Remove all associated states when deleting task
      const collapseStates =
        JSON.parse(localStorage.getItem("collapseStates")) || {};
      const checkboxStates =
        JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
      const stepStates =
        JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
      delete collapseStates[task];
      delete checkboxStates[task];
      delete stepStates[task];
      localStorage.setItem("collapseStates", JSON.stringify(collapseStates));
      localStorage.setItem(
        "taskCheckboxStates",
        JSON.stringify(checkboxStates)
      );
      localStorage.setItem("stepCheckboxStates", JSON.stringify(stepStates));
      deleteTask(index);
    });

    controlsContainer.appendChild(deleteBtn);

    taskContainer.appendChild(taskCheckbox);
    taskContainer.appendChild(taskText);
    taskContainer.appendChild(controlsContainer);
    li.appendChild(taskContainer);

    // Create sublist for steps
    const sublist = document.createElement("ul");
    sublist.classList.add("sub-tasks");
    sublist.style.display = isExpanded ? "block" : "none";

    // Add steps if they exist
    if (steps && steps.length > 0) {
      steps.forEach((step, stepIndex) => {
        const subLi = document.createElement("li");
        subLi.classList.add("sub-task-item");

        const stepCheckbox = document.createElement("input");
        stepCheckbox.type = "checkbox";
        stepCheckbox.classList.add("step-checkbox");

        // Get and set the saved step checkbox state
        const isStepChecked = getStepCheckboxState(task, stepIndex);
        stepCheckbox.checked = isStepChecked;

        // Add event listener to save step checkbox state
        stepCheckbox.addEventListener("change", () => {
          saveStepCheckboxState(task, stepIndex, stepCheckbox.checked);
        });

        subLi.appendChild(stepCheckbox);
        subLi.appendChild(document.createTextNode(step));
        sublist.appendChild(subLi);
      });
    } else {
      const loadingLi = document.createElement("li");
      loadingLi.classList.add("sub-task-item");
      loadingLi.textContent = "Laddar steg...";
      sublist.appendChild(loadingLi);
    }

    li.appendChild(sublist);
    todoList.appendChild(li);
  });
}

function showAlert(message, type) {
  const alertMessage = document.querySelector("#alert");
  alertMessage.textContent = message;

  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}
