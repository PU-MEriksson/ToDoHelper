// Handles localStorage interactions

//Saves whether a task is collapsed (true/false) in localStorage.
export function saveCollapseState(taskId, isCollapsed) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  collapseStates[taskId] = isCollapsed;
  localStorage.setItem("collapseStates", JSON.stringify(collapseStates));
}

//Retrieves the saved collapse state for a specific task, defaulting to true (expanded).
export function getCollapseState(taskId) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  return collapseStates[taskId] !== undefined ? collapseStates[taskId] : true;
}

//Retrieves the saved checkbox state for a specific task, defaulting to false (unchecked).
export function getTaskCheckboxState(task) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  return checkboxStates[task] || false;
}

//Saves whether a task is checked (true/false) in localStorage.
export function saveTaskCheckboxState(task, isChecked) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  checkboxStates[task] = isChecked;
  localStorage.setItem("taskCheckboxStates", JSON.stringify(checkboxStates));
}

//Function to save a task to localStorage
export function saveTaskToLocalStorage(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.unshift(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Function to update a task in localStorage
export function updateTaskInLocalStorage(task, steps) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.task === task ? { ...t, steps } : t));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Retrieves the checkbox state for a specific step, defaulting to false (unchecked).
export function getStepCheckboxState(taskId, stepIndex) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  return stepStates[taskId]?.[stepIndex] || false;
}

//Saves whether a step is checked (true/false) in localStorage.
export function saveStepCheckboxState(taskId, stepIndex, isChecked) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  if (!stepStates[taskId]) {
    stepStates[taskId] = {};
  }
  stepStates[taskId][stepIndex] = isChecked;
  localStorage.setItem("stepCheckboxStates", JSON.stringify(stepStates));
}
