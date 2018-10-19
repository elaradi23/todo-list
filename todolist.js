// Todolist component with props passed
Vue.component("todolist", {
  template:
  `<div>
    <ul>
      <todolist-item @complete="complete(i)" v-for="(item, i) in todolist" :item="item"></todolist-item>
    </ul>
  <div>`,
  props: ["todolist"],
  methods: {
    complete: function(i) {
      server.emit("complete", i);
    }
  }
});

// Todolist item component with props passed
Vue.component("todolist-item", {
  template:
`  <li>
    <p>{{ item.title }}</p>
    <input @click='requestComplete' type='checkbox' v-model='item.completed'>
  </li>`,
  props: ["item"],
  methods: {
    requestComplete: function() {
      this.$emit("complete");
    }
  }
});
