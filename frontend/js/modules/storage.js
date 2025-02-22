export function saveCollapseState(taskId, isCollapsed) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  collapseStates[taskId] = isCollapsed;
  localStorage.setItem("collapseStates", JSON.stringify(collapseStates));
}

export function getCollapseState(taskId) {
  const collapseStates =
    JSON.parse(localStorage.getItem("collapseStates")) || {};
  return collapseStates[taskId] !== undefined ? collapseStates[taskId] : true;
}

export function saveTaskCheckboxState(task, isChecked) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  checkboxStates[task] = isChecked;
  localStorage.setItem("taskCheckboxStates", JSON.stringify(checkboxStates));
}

export function getTaskCheckboxState(task) {
  const checkboxStates =
    JSON.parse(localStorage.getItem("taskCheckboxStates")) || {};
  return checkboxStates[task] || false;
}

export function saveStepCheckboxState(taskId, stepIndex, isChecked) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  if (!stepStates[taskId]) {
    stepStates[taskId] = {};
  }
  stepStates[taskId][stepIndex] = isChecked;
  localStorage.setItem("stepCheckboxStates", JSON.stringify(stepStates));
}

export function getStepCheckboxState(taskId, stepIndex) {
  const stepStates =
    JSON.parse(localStorage.getItem("stepCheckboxStates")) || {};
  return stepStates[taskId]?.[stepIndex] || false;
}
