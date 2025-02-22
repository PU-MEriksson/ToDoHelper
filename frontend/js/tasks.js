// Manages task data and logic
import { renderTasks, showAlert } from "./ui.js";
import { saveTaskToLocalStorage, updateTaskInLocalStorage } from "./storage.js";

//Function to add a task to the list
export function addTask() {
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

//Function to fetch AI-generated steps for a task
export async function fetchAI(task, detailLevel = "standard") {
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

//Deletes a task from localStorage and updates the UI.
export function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  showAlert("Uppgift borttagen!", "success");
}
