<template>
  <div
    class="dragWrap"
    draggable="false"
    ref="dragWrapRef"
    :style="{ height: height + 'px', background: bgcolor }"
  >
    <slot>dragWrap</slot>
  </div>
</template>

<script>
export default {
  name: "dragWrap",
  components: {},
  props: {
    item: {
      type: Object
    },
    height: {
      type: Number
    },
    bgcolor: {
      type: String,
      default: "#ffffff"
    }
  },
  data() {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,
      parent: undefined
    };
  },
  methods: {
    cloneWrap($el) {
      let cloneItem = $el.cloneNode(true);
      console.log(cloneItem);
      cloneItem.style.position = "absolute";
      cloneItem.style.left = 0 + "px";
      cloneItem.style.top = 0 + "px";
      this.parent.appendChild(cloneItem);
      return cloneItem;
    }
  },
  created() {
    console.log(this.$refs);
  },
  mounted() {
    let that = this;
    let el = this.$refs.dragWrapRef;
    let $parent = this.$parent;
    console.log($parent);
    this.parent = $parent.$el.children[0];
    el.onmousedown = e => {
      let cloneItem = this.cloneWrap(el);
      var disx = e.clientX - el.offsetLeft;
      var disy = e.clientY - el.offsetTop;
      document.onmousemove = function(e) {
        let left = e.clientX - disx;
        let top = e.clientY - disy;
        if (left < 0) {
          left = 0;
        }
        // if (top < 0) {
        //   top = 0;
        // }
        // if (left > binding.value.xx - el.offsetWidth) {
        //   left = binding.value.xx - el.offsetWidth;
        // }
        // if (top > binding.value.yy - el.offsetHeight) {
        //   top = binding.value.yy - el.offsetHeight;
        // }
        // cloneItem.style.left = left + "px";
        cloneItem.style.top = top + "px";
        console.log(that.item.originTop + top);
      };
      document.onmouseup = e => {
        let left = e.clientX - disx;
        let top = e.clientY - disy;
        this.parent.removeChild(cloneItem);
        document.onmousemove = document.onmouseup = null;
        this.$parent.mouseUp({
          e,
          left,
          top: this.item.originTop + top,
          item: this.item
        });
      };
    };
  }
};
</script>

<style>
.dragWrap {
  background: #ffffff;
  height: 120px;
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  border: 1px dashed #ff5500;
  position: absolute;
}
</style>
