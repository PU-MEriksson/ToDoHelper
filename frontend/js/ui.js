// =======================================
// Handles DOM manipulation and rendering
// =======================================

import {
  saveCollapseState,
  getCollapseState,
  saveTaskCheckboxState,
  getTaskCheckboxState,
  getStepCheckboxState,
  saveStepCheckboxState,
} from "./storage.js";

import { deleteTask } from "./tasks.js";

//Function to render tasks from localStorage
export function renderTasks() {
  const todoList = document.querySelector("#to-do-items");
  todoList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(({ task, steps }, index) => {
    const li = createTaskElement(task, steps, index);
    todoList.appendChild(li);
  });
}

//Function to create a task element
function createTaskElement(task, steps, index) {
  const li = document.createElement("li");
  li.classList.add("to-do-item");

  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");

  const taskCheckbox = createTaskCheckbox(task);
  const taskText = createTaskText(task, taskCheckbox.checked);
  const controlsContainer = createControlsContainer(task, index);

  taskContainer.appendChild(taskCheckbox);
  taskContainer.appendChild(taskText);
  taskContainer.appendChild(controlsContainer);
  li.appendChild(taskContainer);

  const sublist = createSublist(task, steps);
  li.appendChild(sublist);

  return li;
}

//Function to create a task checkbox
function createTaskCheckbox(task) {
  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.classList.add("task-checkbox");

  const isChecked = getTaskCheckboxState(task);
  taskCheckbox.checked = isChecked;

  taskCheckbox.addEventListener("change", () => {
    taskText.classList.toggle("completed", taskCheckbox.checked);
    saveTaskCheckboxState(task, taskCheckbox.checked);
  });

  return taskCheckbox;
}

//Function to create task text
function createTaskText(task, isChecked) {
  const taskText = document.createElement("span");
  taskText.textContent = task;
  if (isChecked) {
    taskText.classList.add("completed");
  }
  return taskText;
}

//Function to create controls container
function createControlsContainer(task, index) {
  const controlsContainer = document.createElement("div");
  controlsContainer.classList.add("controls-container");

  const collapseBtn = createCollapseButton(task);
  const deleteBtn = createDeleteButton(task, index);

  controlsContainer.appendChild(collapseBtn);
  controlsContainer.appendChild(deleteBtn);

  return controlsContainer;
}

//Function to create collapse button
function createCollapseButton(task) {
  const isExpanded = getCollapseState(task);
  const collapseBtn = document.createElement("button");
  collapseBtn.innerHTML = isExpanded ? "▼" : "▶";
  collapseBtn.classList.add("collapse-btn");
  collapseBtn.setAttribute("title", "Expandera/Minimera");

  collapseBtn.addEventListener("click", () => {
    const sublist = li.querySelector(".sub-tasks");
    const isCollapsed = sublist.style.display === "none";
    sublist.style.display = isCollapsed ? "block" : "none";
    collapseBtn.innerHTML = isCollapsed ? "▼" : "▶";
    saveCollapseState(task, isCollapsed);
  });

  return collapseBtn;
}

//Function to create delete button
function createDeleteButton(task, index) {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "×";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.setAttribute("title", "Ta bort uppgift");

  deleteBtn.addEventListener("click", () => {
    deleteTask(index);
  });

  return deleteBtn;
}

//Function to create sublist for steps
function createSublist(task, steps) {
  const sublist = document.createElement("ul");
  sublist.classList.add("sub-tasks");
  sublist.style.display = getCollapseState(task) ? "block" : "none";

  if (steps && steps.length > 0) {
    steps.forEach((step, stepIndex) => {
      const subLi = createStepElement(task, step, stepIndex);
      sublist.appendChild(subLi);
    });
  } else {
    const loadingLi = document.createElement("li");
    loadingLi.classList.add("sub-task-item");
    loadingLi.textContent = "Laddar steg...";
    sublist.appendChild(loadingLi);
  }

  return sublist;
}

//Function to create a step element
function createStepElement(task, step, stepIndex) {
  const subLi = document.createElement("li");
  subLi.classList.add("sub-task-item");

  const stepCheckbox = document.createElement("input");
  stepCheckbox.type = "checkbox";
  stepCheckbox.classList.add("step-checkbox");

  const isStepChecked = getStepCheckboxState(task, stepIndex);
  stepCheckbox.checked = isStepChecked;

  stepCheckbox.addEventListener("change", () => {
    saveStepCheckboxState(task, stepIndex, stepCheckbox.checked);
  });

  subLi.appendChild(stepCheckbox);
  subLi.appendChild(document.createTextNode(step));

  return subLi;
}

//Function to show alert messages
export function showAlert(message, type) {
  const alertMessage = document.querySelector("#alert");
  alertMessage.textContent = message;

  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}
