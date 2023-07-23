// Create a "close" button and append it to each list item

// Replace 'http://localhost:3000/api/tasks' with your actual server endpoint
const apiUrl = 'http://localhost:3000/api/tasks';

// ... other code ...

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');

    // Fetch tasks from the server and populate the left pane
    fetchTasks();

    // Handle form submission
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskTitle = taskInput.value;
        addTask(taskTitle);
    });

    // Fetch tasks from the server and populate the left pane
    function fetchTasks() {
        // Replace 'http://localhost:3000/api/tasks' with your actual server endpoint
        const apiUrl = 'http://localhost:3000/api/tasks';

        fetch(apiUrl)
            .then(response => response.json())
            .then(tasks => {
                const taskList = document.getElementById('task-list');
                const emptyStateMessage = document.getElementById('empty-state');

                // Clear any existing tasks in the left pane
                taskList.innerHTML = '';

                // Append each task as a list item to the left pane
                tasks.forEach(task => {
                    const listItem = createTaskListItem(task);
                    taskList.appendChild(listItem);
                });

                // Show or hide the "No tasks yet" message based on tasks count
                if (tasks.length > 0) {
                    emptyStateMessage.style.display = 'none';
                } else {
                    emptyStateMessage.style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }


    // Create a list item for a task
    function createTaskListItem(task) {
        const listItem = document.createElement('li');
        listItem.textContent = task.title;
        listItem.setAttribute('data-id', task.id);

        // Add checkbox to mark task as completed
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            updateTaskStatus(task.id, checkbox.checked);
        });
        listItem.appendChild(checkbox);

        // Add cross icon to delete task
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete');
        deleteIcon.textContent = '❌';
        deleteIcon.addEventListener('click', () => {
            deleteTask(task.id);
        });
        listItem.appendChild(deleteIcon);

        return listItem;
    }

    // Add a task to the server and the left pane
    function addTask(taskTitle) {
        // Replace 'http://localhost:3000/api/tasks' with your actual server endpoint
        const apiUrl = 'http://localhost:3000/api/tasks';

        fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: taskTitle, completed: false }),
            })
            .then(response => response.json())
            .then(newTask => {
                const taskList = document.getElementById('task-list');
                const listItem = createTaskListItem(newTask);
                taskList.appendChild(listItem);
                taskInput.value = '';

                // Hide the "No tasks yet" message after adding a new task
                const emptyStateMessage = document.getElementById('empty-state');
                emptyStateMessage.style.display = 'none';
            })
            .catch(error => console.error('Error adding task:', error));
    }


    // Update task status on the server
    function updateTaskStatus(taskId, isCompleted) {
        // Replace 'http://localhost:3000/api/tasks' with your actual server endpoint
        const apiUrl = `http://localhost:3000/api/tasks/${taskId}`;

        fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: isCompleted }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update the task status on the server.');
                }

                // Find the corresponding list item and update its completed status
                const listItem = document.querySelector(`li[data-id="${taskId}"]`);
                if (listItem) {
                    if (isCompleted) {
                        listItem.classList.add('completed');
                    } else {
                        listItem.classList.remove('completed');
                    }
                }
            })
            .catch(error => console.error('Error updating task status:', error));
    }

    // Delete a task from the server and the left pane
    function deleteTask(taskId) {
        // Replace 'http://localhost:3000/api/tasks' with your actual server endpoint
        const apiUrl = `http://localhost:3000/api/tasks/${taskId}`;

        fetch(apiUrl, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete the task from the server.');
                }
                // Remove the task from the left pane (ul#task-list)
                const listItem = document.querySelector(`li[data-id="${taskId}"]`);
                if (listItem) {
                    listItem.remove();
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    }
});