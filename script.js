const API_BASE_URL = "https://jsl-kanban-api.vercel.app/";

// Load user preferences and tasks from localStorage
let userPreferences = JSON.parse(localStorage.getItem("kanbanPreferences")) || {
  theme: "light",
  sidebarHidden: false
};
let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

/**
 * Saves user preferences to localStorage.
 */
function savePreferences() {
  localStorage.setItem("kanbanPreferences", JSON.stringify(userPreferences));
}

/**
 * Saves tasks to localStorage.
 */
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

/**
 * Showsl loading indicator.
 */
function showLoadingIndicator() {
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.classList.remove("hidden");
  }
}

/**
 * Hides loading indicator.
 */
function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }
}

/**
 * Fetches tasks from the API if localStorage is empty.
 * @returns {Promise<Array<Object>>} Array of task objects.
 */
async function fetchTasks() {
  if (tasks.length > 0) {
    return tasks;
  }

  // Otherwise, fetch from API
  showLoadingIndicator();
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);
    tasks = await response.json();
    saveTasks(); 
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Failed to load tasks from server. Starting with empty task list.");
    return tasks; 
  } finally {
    hideLoadingIndicator();
  }
}

/**
 * Creates a new task in localStorage.
 * @param {Object} task - Task data object.
 * @returns {Object} Created task object.
 */
function createTask(task) {
  tasks.push(task);
  saveTasks();
  return task;
}

/**
 * Updates a task in localStorage.
 * @param {number} taskId - ID of the task to update.
 * @param {Object} task - Updated task data.
 * @returns {Object} Updated task object or null if not found.
 */
function updateTask(taskId, task) {
  tasks = tasks.map(t => (t.id === taskId ? { ...t, ...task } : t));
  saveTasks();
  return task;
}

/**
 * Deletes a task from localStorage.
 * @param {number} taskId - ID of the task to delete.
 * @returns {boolean} True if deletion was successful.
 */
function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  return true;
}

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
 * Renders all tasks to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * Updates column headers.
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
  clearExistingTasks();
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
  updateColumnHeaders(tasks);
}

/**
 * Updates the column headers with task counts.
 * @param {Array<Object>} tasks - Array of task objects.
 */
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
  descInput.value = task.description || "";
  statusSelect.value = task.status;
  modal.dataset.taskId = task.id;

  modal.showModal();
}

/**
 * Sets up modal close behavior and task form submission.
 */
function setupModalHandlers() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  const taskForm = document.getElementById("task-form");
  const deleteBtn = document.getElementById("delete-task-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskId = parseInt(modal.dataset.taskId);
    const updatedTask = {
      title: document.getElementById("task-title").value,
      description: document.getElementById("task-desc").value,
      status: document.getElementById("task-status").value
    };

    const result = updateTask(taskId, updatedTask);
    if (result) {
      renderTasks(tasks);
      modal.close();
    }
  });

  deleteBtn.addEventListener("click", () => {
    const taskId = parseInt(modal.dataset.taskId);
    const taskTitle = document.getElementById("task-title").value;
    if (confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) {
      const success = deleteTask(taskId);
      if (success) {
        renderTasks(tasks);
        modal.close();
      }
    }});
}

/**
 * Sets up new task modal behavior.
 */
function setupNewTaskModal() {
  const openNewTaskModal = document.getElementById("add-task-btn");
  const newTaskModal = document.getElementById("new-task-modal");
  const closeNewTaskModal = document.getElementById("new-close-modal-btn");
  const customBackdrop = document.getElementById("custom-backdrop");
  const newTaskForm = document.getElementById("new-task-form");

  openNewTaskModal.addEventListener("click", () => {
    newTaskModal.style.display = "block";
    customBackdrop.style.display = "block";
  });

  closeNewTaskModal.addEventListener("click", () => {
    newTaskModal.style.display = "none";
    customBackdrop.style.display = "none";
  });

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(), // Local ID since API is not used after initial fetch
      title: document.getElementById("new-task-title").value,
      description: document.getElementById("new-task-desc").value,
      status: document.getElementById("new-task-status").value
    };

    const result = createTask(newTask);
    if (result) {
      renderTasks(tasks);
      newTaskForm.reset();
      newTaskModal.style.display = "none";
      customBackdrop.style.display = "none";
    }
  });
}

/**
 * Sets up sidebar toggle behavior.
 */
function setupSidebarToggle() {
  const hideSidebar = document.getElementsByClassName("side-bar")[0];
  const hideSidebarBtn = document.getElementById("hide-sidebar");
  const showSidebar = document.getElementById("show-side-bar");

  hideSidebar.classList.toggle("hidden", userPreferences.sidebarHidden);
  showSidebar.classList.toggle("hidden", !userPreferences.sidebarHidden);

  hideSidebarBtn.addEventListener("click", () => {
    hideSidebar.classList.add("hidden");
    showSidebar.classList.remove("hidden");
    userPreferences.sidebarHidden = true;
    savePreferences();
  });

  showSidebar.addEventListener("click", () => {
    hideSidebar.classList.remove("hidden");
    showSidebar.classList.add("hidden");
    userPreferences.sidebarHidden = false;
    savePreferences();
  });
}

/**
 * Sets up mobile sidebar modal behavior.
 */
function setupMobileSidebar() {
  const lightSidebar = document.getElementById("logo-mobile");
  const darkSidebar = document.getElementById("logo-dark-mobile");
  const showLightSidebar = document.getElementById("mobile-modal-light");
  const closeMobileModalBtn = document.getElementById("close-mobile-modal-btn");

  lightSidebar.addEventListener("click", () => {
    showLightSidebar.showModal();
  });

  darkSidebar.addEventListener("click", () => {
    showLightSidebar.showModal();
  });

  closeMobileModalBtn.addEventListener("click", () => {
    showLightSidebar.close();
  });
}

/**
 * Sets up theme toggle behavior.
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById("mode-toggle-btn");
  const themeMobileToggle = document.getElementById("mobile-toggle-btn");

  document.body.classList.toggle("dark", userPreferences.theme === "dark");
  themeToggle.checked = userPreferences.theme === "dark";
  themeMobileToggle.checked = userPreferences.theme === "dark";

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
    userPreferences.theme = themeToggle.checked ? "dark" : "light";
    savePreferences();
  });

  themeMobileToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeMobileToggle.checked);
    userPreferences.theme = themeMobileToggle.checked ? "dark" : "light";
    savePreferences();
  });
}

/**
 * Initializes the task board and UI handlers.
 */
async function initTaskBoard() {
  tasks = await fetchTasks();
  renderTasks(tasks);
  setupModalHandlers();
  setupNewTaskModal();
  setupSidebarToggle();
  setupMobileSidebar();
  setupThemeToggle();
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);