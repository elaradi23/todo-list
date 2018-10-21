// Todolist component with props passed
Vue.component("todolist", {
  template:
  `<div>
    <div class="todos-list">
      <h3 class="no-todos" v-if="todolist.length == 0">Nothing to do...?</h3>
      <ul class="list-group list-group-flush" v-else>
        <todolist-item @remove="remove(i)" @complete="complete(i)" v-for="(item, i) in todolist" :item="item"></todolist-item>
      </ul>
    </div>
    <div class="row">
      <div class="col-6">
        <button class="btn btn-light" v-on:click="completeAll">Complete All &nbsp<i class="fas fa-check-square"></i></button>
      </div>
      <div class="col-6">
        <button class="btn btn-light" v-on:click="removeAll">Delete All &nbsp<i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  <div>`,
  props: ["todolist"],
  methods: {
    complete: function(i) {
      if (server.connected) {
        server.emit("complete", i);
      } else {
        this.todolist[i].completed = true;
        localStorage.todolist = JSON.stringify(this.todolist);
      }
    },
    remove: function(i) {
      if (server.connected) {
        server.emit("delete", i);
      } else {
        this.todolist.splice(i, 1);
        localStorage.todolist = JSON.stringify(this.todolist);
      }
    },
    completeAll: function() {
      if (server.connected) {
        server.emit("completeAll");
      } else {
        this.todolist.forEach(function(todo) {
          todo.completed = true;
        });
        localStorage.todolist = JSON.stringify(this.todolist);
      }
    },
    removeAll: function() {
      if (server.connected) {
        server.emit("deleteAll");
      } else {
        this.todolist = [];
        localStorage.todolist = JSON.stringify(this.todolist);
      }
    }
  }
});

// Todolist item component with props passed
Vue.component("todolist-item", {
  template:
  `<li class="list-group-item">
    <div v-if="item.completed" class="todo-item">
    <input @click="requestComplete" type="checkbox" v-model="item.completed"">
      <label class="completed">{{ item.title }} &nbsp<i v-bind:class="getClass(item.title)"></label>
      <button class="btn btn-outline-secondary float-right" @click="requestDelete">Delete</button>
    </div>
    <div v-else>
      <input @click="requestComplete" type="checkbox" v-model="item.completed"">
      <label>{{ item.title }} &nbsp<i v-bind:class="getClass(item.title)"></i></label>
      <button class="btn btn-outline-secondary float-right" @click="requestDelete">Delete</button>
    </div>
  </li>`,
  props: ["item"],
  methods: {
    requestComplete: function() {
      this.$emit("complete");
    },
    requestDelete: function() {
      this.$emit("remove");
    },
    getClass(property) {
      let icon = property.split(" ").pop().toLowerCase();
      return "fas fa-" + icon;
    }
  }
});
