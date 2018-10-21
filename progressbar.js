// Progress bar component
Vue.component("progressbar", {
  template:
  `<div class="progress">
    <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{width: completed + '%'}"></div>
  </div>`,
  props: ["completed"]
});
