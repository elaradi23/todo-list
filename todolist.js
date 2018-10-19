// Todolist component with props passed
Vue.component("todolist", {
  template: `<div>
    <ul>
      <todolist-item @remove="remove(i)" @complete="complete(i)" v-for="(item, i) in todolist" :item="item"></todolist-item>
    </ul>
    <button v-on:click="completeAll">Complete All Todos</button>
    <button v-on:click="removeAll">Delete All Todos</button>
  <div>`,
  props: ["todolist"],
  methods: {
    complete: function(i) {
      server.emit("complete", i);
      if (server.connected) {
        server.emit("complete", i);
      } else {
        this.todolist[i].complete = true;
      }
    },
    remove: function(i) {
      if (server.connected) {
        server.emit("delete", i);
      } else {
        this.todolist.splice(i, 1);
      }
    },
    completeAll: function() {
      server.emit("completeAll");
      if (server.connected) {
        server.emit("completeAll");
      } else {
        this.todolist.forEach(function(todo) {
          todo.completed = true;
        });
        vm.$broadcast("persist");
      }
    },
    removeAll: function() {
      server.emit("deleteAll");
    }
  }
});

// Todolist item component with props passed
Vue.component("todolist-item", {
  template: `<li>
    <p>{{ item.title }}</p>
    <input @click="requestComplete" type="checkbox" v-model="item.completed">
    <button @click="requestDelete">Delete</button>
  </li>`,
  props: ["item"],
  methods: {
    requestComplete: function() {
      this.$emit("complete");
    },
    requestDelete: function() {
      this.$emit("remove");
    }
  }
});
