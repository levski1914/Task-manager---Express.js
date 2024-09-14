const express = require("express");
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();
const taskFilePath = path.join(__dirname, "data", "task.json");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Път към index.html извън public
});

app.use(bodyParser.json());

function getTasks() {
  const data = fs.readFileSync(taskFilePath, "utf8");

  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

app.get("/task", (req, res) => {
  const tasks = getTasks();

  res.json(tasks);
});

app.post("/task", (req, res) => {
  const tasks = getTasks();

  const newTask = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.delete("/task/:id", (req, res) => {
  let tasks = getTasks();

  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(tasks);
  res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
