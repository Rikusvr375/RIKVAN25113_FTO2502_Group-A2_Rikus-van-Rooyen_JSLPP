import { initialTasks } from "./initialData.js";

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || initialTasks;
/**
 * Creates a single task DOM element.
 * @param {Object} task - Task data object.
 * @param {string} task.title - Title of the task.
 * @param {number} task.id - Unique task ID.
 * @param {string} task.status - Status column: 'todo', 'doing', or 'done'.
 * @returns {HTMLElement} The created task div element.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}


// Opening the new task modal

const openNewTaskModal = document.getElementById("add-task-btn");
const newTaskModal = document.getElementById("new-task-modal");
const closeNewTaskModal = document.getElementById("new-close-modal-btn")
const customBackdrop = document.getElementById("custom-backdrop")

document.getElementById("new-task-form").addEventListener("submit", (e) => {
  e.preventDefault();
});

openNewTaskModal.addEventListener("click", () => {
  newTaskModal.style.display = "block";
  customBackdrop.style.display = "block";
});

closeNewTaskModal.addEventListener("click", () => {
  newTaskModal.style.display = "none";
  customBackdrop.style.display = "none";
});

/**
 * Finds the task container element based on task status.
 * @param {string} status - The task status ('todo', 'doing', or 'done').
 * @returns {HTMLElement|null} The container element, or null if not found.
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clears all existing task-divs from all task containers.
 */
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

/**
 * Renders all tasks from initial data to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * Updates column headers
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
}

function updateColumnHeaders(tasks) {
  const statusCounts = {
    todo: 0,
    doing: 0,
    done: 0
  };

  tasks.forEach(task => statusCounts[task.status]++);

  document.getElementById("toDoText").textContent = `TODO (${statusCounts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${statusCounts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${statusCounts.done})`;
}
/**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  modal.showModal();
}

/**
 * Deletes existing data when delete task button is clicked
 */



/**
 * changing theme toggle
 */
const themeToggle = document.getElementById("mode-toggle-btn");

themeToggle.addEventListener('change', function() {
    if (themeToggle.checked) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
})


/**
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}

/**
 * function to handle newly added tasks
 */
document.getElementById("new-task-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newTitle = document.getElementById("new-task-title").value;
  const newDescription = document.getElementById("new-task-desc").value;
  const newStatus = document.getElementById("new-task-status").value;


  const newTask = {
    id: Date.now(),
    title: newTitle, 
    description: newDescription,
    status: newStatus 
  };


const container = getTaskContainerByStatus(newStatus);
if (container) {
  const taskElement = createTaskElement(newTask);
  container.appendChild(taskElement)
}

/** 
*  Update tasks array and save to localStorage
*/
  tasks.push(newTask);
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));

/**
 * update column headers 
 */  
updateColumnHeaders(tasks);

  document.getElementById("new-task-form").reset();
  newTaskModal.style.display = "none";
  customBackdrop.style.display = "none";
});

/**
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  clearExistingTasks();
  renderTasks(tasks);
  setupModalCloseHandler();
  updateColumnHeaders(tasks);
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);

