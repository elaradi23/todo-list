const server = require("socket.io")();
const firstTodos = require("./data");
const Todo = require("./todo");

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map(t => {
  // Form new Todo objects
  return new Todo(t.title);
});

server.on("connection", client => {
  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    client.emit("load", DB);
  };

  // Sends a message to client(s) of new added todo
  const addTodo = addedTodo => {
    server.emit("newTodo", addedTodo);
  };

  // Accepts when a client makes a new todo
  client.on("make", t => {
    // Make a new todo
    const newTodo = new Todo(t.title);

    // Push this newly created todo to our database
    DB.push(newTodo);

    // Send the latest todo item to the client
    addTodo(t);
  });

  // Sets a todo to be completed
  client.on("complete", i => {
    DB[i].completed = true;
    server.emit("complete", i);
  });

  // Deletes a todo item
  client.on("delete", i => {
    DB.splice(i, 1);
    server.emit("delete", i);
  });

  // Sets all todos to completed
  client.on("completeAll", () => {
    DB.forEach(function(todo) {
      todo.completed = true;
    });
    server.emit("completeAll");
  });

  // Deletes all todo items
  client.on("deleteAll", () => {
    DB.length = 0;
    server.emit("deleteAll");
  });

  // Send the DB downstream on connect
  reloadTodos();
});

console.log("Waiting for clients to connect");
server.listen(3003);
