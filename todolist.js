// Todolist component with props passed
Vue.component("todolist", {
  template: `<div class>
    <ul class="list-group">
      <todolist-item @remove="remove(i)" @complete="complete(i)" v-for="(item, i) in todolist" :item="item"></todolist-item>
    </ul>
    <button class="btn btn-primary btn-lg btn-block" v-on:click="completeAll">Complete All Todos</button>
    <button class="btn btn-primary btn-lg btn-block" v-on:click="removeAll">Delete All Todos</button>
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
  template: `<li class="list-group-item">
  <div class="container-fluid">
    <input @click="requestComplete" type="checkbox" v-model="item.completed">
    <label v-if="item.completed" v-else :style="{ 'text-decoration': 'line-through' }">{{ item.title }}</label>
    <label v-else>{{ item.title }}</label>
    <button class="btn btn-outline-secondary" @click="requestDelete">Delete</button>
</div>
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
