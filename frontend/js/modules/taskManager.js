import { showAlert } from "./ui.js";

export function saveTaskToLocalStorage(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.unshift(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function updateTaskInLocalStorage(task, steps) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.task === task ? { ...t, steps } : t));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  showAlert("Uppgift borttagen!", "success");
}

export function loadStoredTasks(renderTasks) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(tasks);
}

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
