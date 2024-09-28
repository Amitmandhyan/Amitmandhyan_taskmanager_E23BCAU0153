const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { sendReminderSMS } = require('./reminders'); // Import SMS function

const app = express();
app.use(bodyParser.json());

// Read tasks from JSON file
let tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json')));

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/add-task', (req, res) => {
  const { name, dueDate, category, priority, phoneNumber } = req.body;
  const newTask = {
    id: Date.now(),
    name,
    dueDate,
    category,
    priority,
    phoneNumber,  // Phone number for reminders
    completed: false,
    progress: 0
  };

  tasks.push(newTask);
  fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
  res.json({ message: 'Task added successfully!' });
});

app.put('/complete-task/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id == id);
  if (task) {
    task.completed = true;
    task.progress = 100;
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));

    // Send notification for task completion
    sendReminderSMS(task.phoneNumber, `Task "${task.name}" completed.`);
    res.json({ message: 'Task marked as completed!' });
  } else {
    res.status(404).json({ message: 'Task not found!' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

