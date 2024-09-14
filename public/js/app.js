const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const fetchTasks = async () => {
  const res = await fetch("/task");
  const tasks = await res.json();
  taskList.innerHTML = "";
  tasks.forEach(addToTaskList);
};

const taskExist = (taskTitle) => {
  const tasks = document.querySelectorAll("#taskList li span");

  for (let task of tasks) {
    if (
      task.textContent.trim().toLowerCase() === taskTitle.trim().toLowerCase()
    ) {
      return true;
    }
    return false;
  }
};

const addToTaskList = (task) => {
  const li = document.createElement("li");
  li.className = "task";
  li.innerHTML = `
    <span>${task.title}</span>
    <button onclick="deleteTask(${task.id})">Delete</button>
  `;
  taskList.appendChild(li);

  setTimeout(() => {
    li.classList.remove("task-adding");
  }, 10);
};

addTaskBtn.addEventListener("click", async () => {
  const taskTitle = taskInput.value;
  if (taskExist(taskTitle)) {
    alert("This task already exist");
    return;
  }

  if (taskInput.value === "") {
    window.alert("Enter some task");
    return;
  } else {
    const task = {
      title: taskTitle,
    };

    const res = await fetch("/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const newTask = await res.json();
    addToTaskList(newTask);
    taskInput.value = "";
  }
});

const deleteTask = async (id) => {
  const taskElement = document.querySelector(
    `button[onclick="deleteTask(${id})"]`
  ).parentElement;

  taskElement.classList.add("task-removing");

  setTimeout(() => {
    taskElement.remove();
  }, 500);
  await fetch(`/task/${id}`, {
    method: "DELETE",
  });
};

fetchTasks();
