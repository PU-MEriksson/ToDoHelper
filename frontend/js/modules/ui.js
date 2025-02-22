export function showAlert(message, type) {
  const alertMessage = document.querySelector("#alert");
  alertMessage.textContent = message;

  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}

export function renderTasks(
  tasks,
  getTaskCheckboxState,
  getStepCheckboxState,
  getCollapseState,
  saveTaskCheckboxState,
  saveStepCheckboxState,
  saveCollapseState,
  deleteTask
) {
  const todoList = document.querySelector("#to-do-items");
  todoList.innerHTML = "";

  tasks.forEach(({ task, steps }, index) => {
    const li = document.createElement("li");
    li.classList.add("to-do-item");

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");

    const isChecked = getTaskCheckboxState(task);
    taskCheckbox.checked = isChecked;

    const taskText = document.createElement("span");
    taskText.textContent = task;
    if (isChecked) {
      taskText.classList.add("completed");
    }

    taskCheckbox.addEventListener("change", () => {
      taskText.classList.toggle("completed", taskCheckbox.checked);
      saveTaskCheckboxState(task, taskCheckbox.checked);
    });

    const controlsContainer = document.createElement("div");
    controlsContainer.classList.add("controls-container");

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

    controlsContainer.appendChild(collapseBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("title", "Ta bort uppgift");
    deleteBtn.addEventListener("click", () => {
      deleteTask(index);
    });

    controlsContainer.appendChild(deleteBtn);

    taskContainer.appendChild(taskCheckbox);
    taskContainer.appendChild(taskText);
    taskContainer.appendChild(controlsContainer);
    li.appendChild(taskContainer);

    const sublist = document.createElement("ul");
    sublist.classList.add("sub-tasks");
    sublist.style.display = isExpanded ? "block" : "none";

    if (steps && steps.length > 0) {
      steps.forEach((step, stepIndex) => {
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
