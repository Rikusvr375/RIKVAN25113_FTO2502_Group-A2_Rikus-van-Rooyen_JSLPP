# Kanban Task Management
A **web-based Kanban board application** for organizing and managing tasks efficiently. Users can create, update, and delete tasks, categorize them into **TODO**, **DOING**, and **DONE** columns, and toggle between **light and dark themes**. It features a **responsive design** with a sidebar for navigation and modals for task management.
---
## 📑 Table of Contents
- [Important Links]
- [Setup Guide]  
- [User Guide] 
- [Technologies Used]
---

## 🔗 Important Links
- **Presentation**: [App Presentation](https://www.veed.io/view/fafdb4f6-bf56-489f-99ea-67e9ad67b4c1?panel=share)
- **Live Demo**: [Live App Link](https://kanbanboardtaskmanager.netlify.app/)
- **API Source**: [JSL Kanban API](https://jsl-kanban-api.vercel.app/)
- **Design Inspiration**: [Figma design link](https://www.figma.com/design/y7bFCUYL5ZHfPeojACBXg2/Challenges-%7C-JSL?node-id=6033-11092&t=mAqn98yM0oisQ0Hf-0)

## 🚀 Setup Guide
### 1. Clone the Repository
```bash
git clone <repository-url>
```
### 2. Navigate to the Project Directory
```bash
cd kanban-task-management
```
### 3. Install Dependencies
No installation is required. The app uses **JavaScript** and **CDN-hosted fonts**. Make sure you have a modern web browser (e.g., Chrome, Firefox).
### 4. Verify Assets
Ensure the `assets/` folder contains:
- `logo-light.svg`, `logo-dark.svg`, `favicon.svg`,  
- `dark-favicon.png`, `updated-eyes.png`,  
- `updated-sun.png`, `updated-moon.png`, `updated-no-icon.png`
Also confirm that `styles.css` and `script.js` are in the root directory.
### 5. Test the Application
Open the app in your browser to confirm:
- The board loads correctly
- Tasks are loaded (or initialized in `localStorage`)
- UI is responsive
---
## 🧭 User Guide
### 📋 Viewing the Board
- Three columns: **TODO**, **DOING**, and **DONE**
- Column headers display task counts (e.g., `TODO (2)`)
### ➕ Adding a New Task
1. Click the "**+ Add New Task**" button
2. Fill in the title, description, and select a status
3. Click "**Create Task**" to add it to the board
### ✏️ Editing a Task
- Click any task card to open the edit modal
- Update fields or delete the task
- Save changes with "**Save Changes**"
### 🧭 Toggling the Sidebar
- **Desktop**: Use "**Hide Sidebar**" and eye icon toggle
- **Mobile/Tablet**: Click the logo to open sidebar modal; use "×" to close
### 🌙 Switching Themes
- Toggle light/dark theme via sidebar toggle
- Theme preference saved in `localStorage`
### 📱 Responsive Design
- **Desktop**: Full sidebar, horizontal columns
- **Tablet**: Sidebar hidden, accessible via header logo
- **Mobile**: Vertical stacked columns, compact buttons
---
## 🛠 Technologies Used
- **HTML5**: Structural layout
- **CSS3**: Styling, dark mode, responsive layout
- **JavaScript**: Logic and interactivity
- **LocalStorage**: Persistence for tasks and theme
- **Google Fonts**: Typography (`Plus Jakarta Sans`)
- **Fetch API**: Initial task data from remote API  
  `https://jsl-kanban-api.vercel.app/`
- **Responsive Design**: Media queries for all screen sizes
---
