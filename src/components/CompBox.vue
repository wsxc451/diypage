<template>
  <div class="compBox">
    <vue-draggable-resizable
      :w="100"
      :h="60"
      @dragging="onDrag"
      @resizing="onResize"
      :parent="false"
    >
      Width: {{ boxWidth }} / Height:
      {{ boxHeight }}
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
export default {
  name: "compBox",
  components: { VueDraggableResizable },
  data() {
    return {
      lists: [1, 2, 3, 4, 5],
      x: 0,
      y: 0,
      boxWidth: 100,
      boxHeight: 60
    };
  },
  methods: {
    onResize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.boxWidth = width;
      this.boxHeight = height;
    },
    onDrag: function(x, y) {
      this.x = x;
      this.y = y;
    },
    dropStart(e) {
      console.log(1, e.target);
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
</script>

<style scoped>
.comp2 {
  width: 100%;
  background: blue;
  color: #ffffff;
}
</style>
