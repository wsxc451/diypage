<template>
  <div class="drag-me container">
    <div class="mobile-app" ref="mobileRef">
      <DragWrap2
        v-for="wrap in wraps"
        :item="wrap"
        :key="wrap.id"
        :height="wrap.heightBox || 100"
        :style="{ transform: 'translateY(' + wrap.originTop + 'px)' }"
        class="drag-wrap"
        :bgcolor="wrap.bgcolor"
        :id="'warp_' + wrap.id"
      >
        {{ wrap.name }} - {{ wrap.originTop }}
      </DragWrap2>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import anime from "animejs/lib/anime.es.js";
import DragWrap2 from "./drag/DragWrap2";

export default {
  name: "dragMe",
  components: { DragWrap2 },
  data() {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,
      wrapsEles: [],
      wraps: [
        {
          name: "组件1",
          order: 1,
          id: 1000,
          heightBox: 100,
          bgcolor: "#e3e3e3"
        },
        { name: "组件2", order: 2, id: 1001, heightBox: 200 },
        { name: "组件3", order: 3, id: 1002, heightBox: 80 },
        { name: "组件4", order: 4, id: 1004, heightBox: 100 },
        { name: "组件5", order: 5, id: 1005, heightBox: 80 }
      ]
    };
  },
  methods: {
    mouseUp(val) {
      console.log(val);
      let dragItem = val.item;
      let findEles = this.findReplaceNode(val);
      let dragEle = this.wraps.find(item => dragItem.order == item.order);
      let replaceEle = this.wraps.find(item => findEles.order == item.order);
      if (dragEle.originTop < replaceEle.originTop) {
        this.dragItemDown(val);
      } else {
        this.dragItemUp(val);
      }
    },
    dragItemDown(val) {
      console.log("dragItemDown");
      let dragItem = val.item;
      let findEles = this.findReplaceNode(val);
      let dragEle = this.wraps.find(item => dragItem.order == item.order);
      let replaceEle = this.wraps.find(item => findEles.order == item.order);
      let preTop = dragItem.originTop;
      console.log("replaceEle", replaceEle.originTop, dragItem.height);
      // 下面的元素上移,上移位置
      let changeList = [];
      this.wraps.forEach(item => {
        if (
          preTop <= item.originTop &&
          item.originTop <= val.top &&
          item.id != dragItem.id
        ) {
          let upEleTop = item.originTop - dragEle.height;
          changeList.push({ id: item.id, value: upEleTop });
          //item.originTop = upEleTop;
          anime({
            //targets: ["#warp_" + replaceEle.id],
            targets: ["#warp_" + item.id],
            translateY: upEleTop,
            duration: 1500,
            loop: false
          });
        }
      });
      let dragNow = replaceEle.originTop + replaceEle.height - dragItem.height;
      anime({
        targets: ["#warp_" + dragItem.id],
        translateY: dragNow + "px",
        duration: 200,
        loop: false
      });
      changeList.push({ id: dragItem.id, value: dragNow });
      setTimeout(() => {
        this.changeData(changeList);
      }, 500);
    },
    dragItemUp(val) {
      console.log("dragItemUp");
      let dragItem = val.item;
      let findEles = this.findReplaceNode(val);
      let dragEle = this.wraps.find(item => dragItem.order == item.order);
      let replaceEle = this.wraps.find(item => findEles.order == item.order);
      let preTop = replaceEle.originTop;
      // 下面的元素上移,上移位置
      let countTop = 0;
      let changeList = [];
      this.wraps.forEach(item => {
        if (
          preTop <= item.originTop &&
          item.originTop <= dragEle.originTop &&
          item.id != dragItem.id
        ) {
          let upEleTop = item.originTop + dragEle.height;
          countTop = item.originTop;
          changeList.push({ id: item.id, value: upEleTop });
          //item.originTop = upEleTop;
          anime({
            //targets: ["#warp_" + replaceEle.id],
            targets: ["#warp_" + item.id],
            translateY: upEleTop,
            duration: 1500,
            loop: false
          });
        }
      });
      console.log("xxxx", countTop);
      let dragNow = replaceEle.originTop;
      anime({
        targets: ["#warp_" + dragItem.id],
        translateY: dragNow + "px",
        duration: 200,
        loop: false
      });
      changeList.push({ id: dragItem.id, value: dragNow });
      setTimeout(() => {
        this.changeData(changeList);
      }, 500);
    },
    changeData(changeList) {
      console.log(changeList, this.wraps);
      this.wraps.forEach((wrap, index) => {
        let info = changeList.find(item => item.id == wrap.id);
        if (info) {
          console.log(info);
          Vue.set(
            this.wraps,
            index,
            Object.assign({}, this.wraps[index], { originTop: info.value })
          );
        }
      });
      this.wraps.sort((a, b) => a.originTop - b.originTop);
    },
    findReplaceNode(val) {
      console.log(val);
      console.log(val.top);
      return this.wraps.find(item => item.originTop + item.height > val.top);
    },
    initOriginTop() {
      let elesParent = this.$refs.mobileRef;
      let nodesC = Array.prototype.slice.call(elesParent.childNodes);

      let wrapHeight = 0;
      nodesC.forEach((element, index) => {
        console.log(element.getBoundingClientRect());
        let { height } = element.getBoundingClientRect();
        Vue.set(
          this.wraps,
          index,
          Object.assign({}, this.wraps[index], {
            originTop: wrapHeight
          })
        );
        wrapHeight += height;
      });
    },
    initWrapsPos() {
      let elesParent = this.$refs.mobileRef;
      let that = this;
      // console.log(elesParent.childNodes);
      //let nodesC = elesParent.childNodes;
      let nodesC = Array.prototype.slice.call(elesParent.childNodes);
      this.wrapsEles = nodesC;
      let wrapHeight = 0;
      nodesC.forEach((element, index) => {
        console.log(element.getBoundingClientRect());
        let { left, top, height, width } = element.getBoundingClientRect();
        Vue.set(
          that.wraps,
          index,
          Object.assign({}, this.wraps[index], {
            originTop: wrapHeight,
            nowTop: wrapHeight,
            transformTop: 0,
            transformLeft: 0,
            top,
            left,
            height,
            width
          })
        );
        wrapHeight += height;
        // that.$set(
        //   that.wraps,
        //   index,
        //   Object.assign({},this.wraps[index], { top, left })
        // );
      });
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.initWrapsPos();
  }
};
</script>

<style>
.drag-me {
  text-align: left;
}
.mobile-app {
  border: 1px solid #b3c0d1;
  height: 800px;
  overflow: auto;
  width: 375px;
  position: relative;
}
.drag-wrap {
  transition-duration: 50ms;
}
</style>
