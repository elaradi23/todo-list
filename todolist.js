// Todolist component with props passed
Vue.component("todolist", {
  template:
  `<div>
    <ul>
      <todolist-item v-for="(item, i) in todolist" :item="item"></todolist-item>
    </ul>
  <div>`,
  props: ["todolist"]
});

// Todolist item component with props passed
Vue.component("todolist-item", {
  template:
  `<li>
    <p>{{ item.title }}</p>
  </li>`,
  props: ["item"]
});
