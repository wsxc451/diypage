<template>
  <div id="comps">
    <div class="comp-item" v-for="com in comps" :key="com.id" :style="{ background: com.bgcolor, height: com.height + 'px' }">{{ com.name }}</div>
  </div>
</template>

<script>
import { getRandomColor } from "@/utils.js"
import dragMe3 from "@/components/DragMe3"
import eventBus from "../eventBus"
export default {
  name: "comps-wrap",
  components: {
    dragMe3,
  },
  props: {
    wrapEle: {},
  },
  data() {
    return {
      datas: [],
      comps: [
        { id: 1, name: "组件1", bgcolor: getRandomColor(), height: 100 },
        { id: 2, name: "组件2", bgcolor: getRandomColor(), height: 150 },
        { id: 3, name: "组件3", bgcolor: getRandomColor(), height: 200 },
      ],
    }
  },
  created() {
    let infos = localStorage.getItem("pageInfo")
    if (infos) {
      this.datas = JSON.parse(infos)
    } else {
      this.datas = [
        {
          name: "组件1",
          id: 1001,
          height: 100,
          originTop: 0,
          bgcolor: "#e3e3e3",
        },
        {
          name: "组件2",
          id: 1002,
          height: 200,
          originTop: 0,
          bgcolor: "#20a0ff",
          component: "CompBox",
        },
        {
          name: "组件3",
          id: 1003,
          height: 150,
          originTop: 0,
          bgcolor: "yellow",
        },
        {
          name: "组件4",
          id: 1004,
          originTop: 0,
          height: 120,
          bgcolor: "pink",
        },
      ]
    }
  },
  mounted() {
    this.initDrag()
  },
  methods: {
    cloneNode($el, x, y) {
      let wrapBox = this.wrapEle
      let cloneItem = $el.cloneNode(true)
      cloneItem.style.position = "absolute"
      cloneItem.style.left = x + "px"
      cloneItem.style.top = y + "px"
      wrapBox.appendChild(cloneItem)
      return cloneItem
    },
    addItem() {
      this.$refs.dragMe.addItem()
    },
    savePage() {
      let infos = this.$refs.dragMe.getPageInfos()
      console.log(infos)
      localStorage.setItem("pageInfo", JSON.stringify(infos))
    },
    resetPage() {
      localStorage.removeItem("pageInfo")
    },
    initDrag() {
      let that = this
      let comNodes = document.getElementsByClassName("comp-item")
      Array.prototype.forEach.call(comNodes, (item, itemIndex) => {
        console.log(item)
        item.onselectstart = function() {
          return false
        }
        let el = item
        item.onmousedown = (e) => {
          //let cloneItem = this.cloneWrap(el);
          let pageX = e.target.offsetLeft
          let pageY = e.target.offsetTop
          let cloneItem = that.cloneNode(item, pageX, pageY)
          var disx = e.clientX - el.offsetLeft
          var disy = e.clientY - el.offsetTop
          eventBus.$emit("comp-move-start", { disx, disy })
          document.onmousemove = function(e) {
            let left = e.clientX - disx
            let top = e.clientY - disy
            if (left < 0) {
              left = 0
            }
            cloneItem.style.top = top + "px"
            cloneItem.style.left = left + "px"
            eventBus.$emit("comp-move-ing", { top, left, disx, disy })
          }
          document.onmouseup = (e) => {
            console.log("onmouseup", e)
            let left = e.clientX - disx
            let top = e.clientY - disy
            eventBus.$emit("comp-move-end", Object.assign({}, that.comps[itemIndex], { disx, disy, top }))
            this.wrapEle.removeChild(cloneItem)
            document.onmousemove = document.onmouseup = null
            this.$emit("mouseUp", {
              e,
              left,
              top: top,
              item: this.item,
            })
          }
        }
      })
    },
  },
}
</script>

<style scoped>
#app {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.comp-item {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-bottom: 15px;
  cursor: move;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
}
</style>
