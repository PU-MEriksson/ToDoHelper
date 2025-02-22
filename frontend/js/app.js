// =======================================
// Main entry point
// initializes the application by loading stored tasks and setting up event listeners.
// =======================================

import { addTask } from "./tasks.js";
import { renderTasks } from "./ui.js";

//Function to load stored tasks from localStorage
function loadStoredTasks() {
  renderTasks();
}

//Initializes the application by loading stored tasks and setting up event listeners.
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

//Check if the document is fully loaded before initializing the application.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
