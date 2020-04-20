<template>
  <div class="comp1" draggable="true" v-on:dragstart="dropStart2">
    <div
      v-if="data"
      draggable="true"
      style="position:absolute;left:100px;top:10px;width:200px;height:200px;"
      v-on:dragstart.self="dropStart"
    >
      <vue-draggable-resizable
        :w="100"
        :h="100"
        @dragging="onDrag"
        @resizing="onResize"
        :parent="false"
      >
        <p>
          resize me.<br />
          X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}
        </p>
      </vue-draggable-resizable>
    </div>
    <div v-else>
      empty
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
export default {
  name: "comp1",
  components: {
    VueDraggableResizable
  },
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };
  },
  methods: {
    onResize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function(x, y) {
      this.x = x;
      this.y = y;
    },
    dropStart(e) {
      console.log(1, e.target);
      e.preventDefault();
      e.stopPropagation();
    },
    dropStart2(e) {
      console.log(2, e.target);
      this.$emit("dragstart", true);
    }
  }
};
</script>

<style scoped>
.comp1 {
  width: 100%;
  min-height: 100px;
  background: red;
  color: #ffffff;
  overflow: hidden;
  position: relative;
  border: 1px dashed #e3e3e3;
}
</style>
