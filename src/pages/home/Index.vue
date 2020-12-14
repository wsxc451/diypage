<template>
  <div id="app">
    <el-container>
      <el-header>DIY Page System By Czm</el-header>
      <el-container ref="mainBody">
        <!-- <el-aside width="200px">
          <CompsWrap @mouseUp="mouseUp" :wrapEle="wrapEle"></CompsWrap>
        </el-aside>-->
        <el-container>
          <el-main style="position:relative">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </el-main>
          <!-- <el-footer>
            <el-button type="primary" @click="runStart">runStart</el-button>
            <el-button type="primary" @click="addItem">新增一个元素</el-button>
            <el-button type="primary" class="el-button" @click="savePage">保存当前页面</el-button>
            <el-button type="danger" @click="resetPage">初始化当前页面</el-button>
            <el-button type="danger" @click="getOffsetInfo">test</el-button>
          </el-footer>-->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import dragMe3 from "@/components/DragMe3"
import CompsWrap from "@/components/comps/CompsWrap.vue"
import InputRuner from "@/components/InputRuner.vue"
export default {
  name: "index",
  components: {
    dragMe3,
    CompsWrap,
    InputRuner,
  },
  data() {
    return {
      datas: [],
      hasRadius: false,
      wrapEle: undefined,
    }
  },
  mounted() {
    // this.wrapEle = this.$refs.mainBody.$el;
    // console.log( this.wrapEle );
    // this.initDrag();
  },
  created() {
    // let infos = localStorage.getItem( "pageInfo" );
    // if ( infos ) {
    //   this.datas = JSON.parse( infos );
    // } else {
    //   this.datas = [
    //     {
    //       name: "组件1",
    //       id: 1001,
    //       height: 100,
    //       originTop: 0,
    //       bgcolor: "#e3e3e3"
    //     },
    //     {
    //       name: "组件2",
    //       id: 1002,
    //       height: 200,
    //       originTop: 0,
    //       bgcolor: "#20a0ff",
    //       component: "CompBox"
    //     },
    //     {
    //       name: "组件3",
    //       id: 1003,
    //       height: 150,
    //       originTop: 0,
    //       bgcolor: "yellow"
    //     },
    //     {
    //       name: "组件4",
    //       id: 1004,
    //       originTop: 0,
    //       height: 120,
    //       bgcolor: "pink"
    //     }
    //   ];
    // }
  },
  methods: {
    runStart() {
      this.$refs.inputRuner.runStart()
    },
    getOffsetInfo() {
      this.$refs.dragMe.getOffsetInfo()
    },
    addItem() {
      this.$refs.dragMe.addItem()
    },
    mouseUp(val) {
      console.log(val)
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
      let comNodes = document.getElementsByClassName("comp-item")
      console.log(comNodes)
      Array.prototype.forEach.call(comNodes, (item) => {
        console.log(item)
        item.onselectstart = function() {
          return false
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
}

body > .el-container {
  margin-bottom: 40px;
}

/* .el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
} */
</style>
