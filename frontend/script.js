// frontend/script.js

function loadStoredTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    if (taskList) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            taskList.appendChild(li);
        });
    }
 }
 
 async function processTask() {
    const taskInput = document.getElementById("taskInput");
    const resultsDiv = document.getElementById("results");
    const task = taskInput.value.trim();
 
    if (!task) {
        alert("Please enter a task");
        return;
    }
 
    try {
        resultsDiv.innerHTML = "Processing...";
        const response = await fetch("http://localhost:3000/api/tasks/breakdown", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task }),
        });
 
        if (!response.ok) {
            throw new Error("Failed to process task");
        }
 
        const data = await response.json();
        displayResults(data.steps);
    } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "Error processing task. Please try again.";
    }
 }
 
 function displayResults(steps) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
 
    const list = document.createElement("ol");
    steps.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        list.appendChild(item);
    });
 
    resultsDiv.appendChild(list);
 }
 
 function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();
    
    if (task) {
        // Get existing tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Add new task
        tasks.push(task);
        // Save back to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // Refresh the display
        loadStoredTasks();
        // Clear input
        taskInput.value = '';
    }
 }
 
 // Export the function
 export { processTask };
 
 // Initialize when the module loads
 function init() {
    loadStoredTasks();
    document.querySelector("#add-button").addEventListener("click", addTask);
 }
 
 // Add event listener after export
 if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
 } else {
    init();
 }

/*function addTask() {
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
  /*/
