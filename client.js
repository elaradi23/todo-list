const server = io("http://localhost:3003/");

// Vue instance
var vm = new Vue({
  el: "#app",
  data: {
    todolist: [],
    completed: 0
  },
  watch: {
    todolist(values) {
      update();
    }
  }
});

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
  console.warn(event);
  const input = document.getElementById("todo-input");

  // Prevent whitespace input as a todo item
  if (input.value) {
    // Emit the new todo as some data to the server
    server.emit("make", {
      title: input.value,
      completed: false
    });

    // Clear the input
    input.value = "";
  }

  // Refocus the element
  input.focus();
}

// This function updates local storage and calculates the completed % of our todos
function update() {
  localStorage.todolist = JSON.stringify(this.vm.todolist);
  this.vm.completed = (this.vm.todolist.filter(t => t.completed == true).length / this.vm.todolist.length) * 100;
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on("load", todos => {
  // Ensures syncing of todo list on client app and server DB
  if (
    localStorage.getItem("todolist") == "null" ||
    localStorage.getItem("todolist") == null
  ) {
    todos.forEach(todo => this.vm.todolist.push(todo));
  } else {
    this.vm.todolist = JSON.parse(localStorage.todolist);
    server.emit("syncDB", this.vm.todolist);
  }
});

// This event is for loading the lastest todo item to todos list
server.on("newTodo", todo => {
  this.vm.todolist.push(todo);
});

// This event is for updating a todo when completed
server.on("complete", i => {
  this.vm.todolist[i].completed = true;
  update();
});

// This event is for deleting a todo item
server.on("delete", i => {
  this.vm.todolist.splice(i, 1);
});

// This event assigns all todos as completed
server.on("completeAll", () => {
  this.vm.todolist.forEach(function(todo) {
    todo.completed = true;
  });
  update();
});

// This event deletes all todos
server.on("deleteAll", () => {
  this.vm.todolist = [];
  update();
});

// This event will reserve todos in local storage in case of lost connection
server.on("connect_error", () => {
  var ls = localStorage.getItem("todolist");
  this.vm.todolist = JSON.parse(ls);
});
