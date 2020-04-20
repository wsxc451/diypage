<template>
  <div
    class="dragWrap"
    draggable="false"
    ref="dragWrapRef"
    :style="{ height: height + 'px', background: bgcolor }"
  >
    <div class="dragContentWrap" ref="dragContentWrap">
      <slot></slot>
    </div>
    <div class="oper-btns">
      <span class="oper-btn el-icon-aim" ref="operBtn"></span>
      <span class="oper-btn el-icon-remove" @click.self="removeItem(item)"></span>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
export default {
  name: "dragWrap2",
  components: { VueDraggableResizable },
  props: {
    item: {
      type: Object
    },
    pagePosInfo: {
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
      parent: undefined,
      isDraging: false,
      x: 0,
      y: 0,
      boxWidth: 100,
      boxHeight: 60
    };
  },
  methods: {
    cloneWrap( $el ) {
      return this.$parent.appendItem( $el );
    },
    removeItem( item ) {
      this.$parent.removeItem( item );
    },
    onResize: function ( x, y, width, height ) {
      this.x = x;
      this.y = y;
      this.boxWidth = width;
      this.boxHeight = height;
    },
    onDrag: function ( x, y ) {
      this.x = x;
      this.y = y;
    },
    dropStart( e ) {
      console.log( 1, e.target );
      e.preventDefault();
      e.stopPropagation();
    }
  },
  created() { },
  mounted() {
    let el = this.$refs.dragWrapRef;
    el.onselectstart = function () {
      return false;
    };

    let operBtn = this.$refs.operBtn;
    let $parent = this.$parent;
    this.parent = $parent.$el.children[ 0 ];

    operBtn.onmousedown = e => {
      //let cloneItem = this.cloneWrap(el);
      this.isDraging = !this.isDraging;
      console.log( "onmousedown", this.isDraging );
      let cloneItem = this.cloneWrap( el );
      var disx = e.clientX - el.offsetLeft;
      var disy = e.clientY - el.offsetTop;
      document.onmousemove = function ( e ) {
        let left = e.clientX - disx;
        let top = e.clientY - disy;
        if ( left < 0 ) {
          left = 0;
        }
        cloneItem.style.top = top + "px";
      };

      document.onmouseup = e => {
        console.log( "onmouseup" );
        let left = e.clientX - disx;
        let top = e.clientY - disy;
        this.parent.removeChild( cloneItem );
        document.onmousemove = document.onmouseup = null;
        this.$parent.mouseUp( {
          e,
          left,
          top: this.item.originTop + top,
          item: this.item
        } );
      };
    };
  }
};
</script>

<style scoped>
.dragWrap {
  background: #ffffff;
  height: 120px;
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  border: 1px dashed #ff5500;
  position: absolute;
  padding: 5px;
  box-sizing: border-box;
}
.dragContentWrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.oper-btn {
  position: relative;
  background: #ff5500;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: #fff;
  font-size: 15px;
  box-sizing: border-box;
  padding: 5px;
  cursor: pointer;
}
.oper-btn.el-icon-aim {
  cursor: move;
}
.oper-btns {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
.oper-btns span {
  margin-bottom: 15px;
}
</style>
