const server = io("http://localhost:3003/");

// Vue instance
var vm = new Vue({
  el: "#app",
  data: {
    todolist: []
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
      title: input.value
    });

    // Clear the input
    input.value = "";
  }

  // Refocus the element
  input.focus();
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on("load", todos => {
  // Ensures reset of todo list on client connections already viewing the app
  // instead of appending the rendred todos to existing todos on the app page
  this.vm.todolist = [];
  todos.forEach(todo => this.vm.todolist.push(todo));
});

// This event is for loading the lastest todo item to todos list
server.on("newTodo", todo => {
  this.vm.todolist.push(todo);
});

// This event is for updating a todo when completed
server.on("complete", i => {
  this.vm.todolist[i].completed = true;
});

// This event is for deleting a todo item
server.on("delete", i => {
  console.log("server delete " + i);
  this.vm.todolist.splice(i, 1);
});

// This event assigns all todos as completed
server.on("completeAll", () => {
  this.vm.todolist.forEach(function(todo) {
    todo.completed = true;
  });
});

// This event deletes all todos
server.on("deleteAll", () => {
  this.vm.todolist = [];
});
