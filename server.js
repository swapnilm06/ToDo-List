const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for tasks (replace this with a database in a real-world app)
let tasks = [];

// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        completed: Boolean(completed),
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PATCH update task status
app.patch('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const isCompleted = Boolean(req.body.completed);

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {...task, completed: isCompleted };
        }
        return task;
    });

    const updatedTask = tasks.find(task => task.id === taskId);
    res.json(updatedTask);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});