<template>
  <div class="wrap">
    <div class="left">
      <div class="drag-wrap" v-for="(item, index) in pageWrapList" :key="index" :id="`wrap_${item.sort}`" :ref="`wrap_${item.sort}`">
        <div
          class="drag-item"
          :class="{ draging: item.sort == dragIndex, draggable: dragable }"
          :draggable="false"
          @click="onSelect(item)"
          @dragstart="e => onDragStart(e, item)"
          @dragend="e => onDragEnd(e, item)"
          @dragover="e => onDragOver(e, item)"
          @drag.stop="
            e => {
              onDrag(e, item)
            }
          "
        >
          <template v-if="item.type == 'img'">
            <!--  -->
            <template v-if="item.info">
              <img draggable :src="'http://127.0.0.1:7002/public/' + item.info" style="width:100%" />
            </template>
            <template v-else>
              <div>请点击上传图片</div>
            </template>

            <!-- {{ item.id }} -- {{ item.name }}-- {{ item.sort }}-- t:{{ item.top }}-- mid:{{ item.mid }} -->
          </template>
        </div>
        <!-- <div class="drag-bar" @dragover="e => e.preventDefault()" :class="{ droping: dropIndex == item.sort }"></div> -->
      </div>
      <div class="add_oper" @click="addOper">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
    </div>
    <div class="right">
      <DiyOper @onChange="onChange" />
      <!-- curentY:{{ currenY }}
      <br />
      dragIndex: {{ dragIndex }}
      <br />
      dropIndex: {{ dropIndex }}
      <br /> -->
    </div>
  </div>
</template>
<script>
/**
 * 优化:
 * 1.sort,不需要连续,可以跳跃,只要从大到小即可,目前版本需要连续
 * 2.动画交互优化
 * 3.性能优化
 */
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
import DiyOper from './diyOper'
import anime from 'animejs/lib/anime.es.js'
export default {
  components: { DiyOper },
  name: 'Diy',
  data() {
    return {
      lists: [],
      pageid: null,
      dragIndex: null, // 拖拽的sort
      dropIndex: null, // 放置到某个sort
      dragable: false, // 是否可以拖拽状态
      enterY: null, // 上下滑标记
      offsetY: null, // 鼠标在拖动元素的相对y坐标
      currenY: null // 当前拖拽顶部坐标
    }
  },
  computed: {
    ...mapState({
      operItem: state => state.diypage.operItem,
      pageInfo: state => state.diypage.pageInfo,
      pageWrapList: state => state.diypage.pageWrapList,
      activeTab: state => state.diypage.activeTab
    })
  },
  created() {
    let { id = 1 } = this.$route.query
    this.pageid = id
  },
  mounted() {
    this.getLists()
  },
  methods: {
    ...mapMutations({
      setOperItem: 'diypage/setOperItem',
      setPageInfo: 'diypage/setPageInfo',
      setPageWrapList: 'diypage/setPageWrapList',
      setActiveTab: 'diypage/setActiveTab'
    }),
    onChange(event) {
      if (!this.dragable) {
        return
      }
      let sortTarget = this.operItem.sort
      if (event.type === 'down') {
        if (sortTarget >= this.pageWrapList.length) {
          return
        }
        this.changeDown({ sort: sortTarget }, { sort: sortTarget + 1 })
      } else {
        if (sortTarget - 1 <= 0) {
          return
        }
        this.changeUp({ sort: sortTarget }, { sort: sortTarget - 1 })
      }
    },
    onSelect(item) {
      this.setOperItem(item)
      this.setActiveTab('wrap')
    },
    getLists() {
      axios.get('http://127.0.0.1:7002/page/get', { params: { id: this.pageid } }).then(({ data }) => {
        // this.pageWrapList = res.data.data
        this.setPageInfo(data.data.page)
        this.setPageWrapList(data.data.wrapList)
        setTimeout(() => {
          this.reSetList()
        }, 500)
      })
    },
    calcPosToLists() {
      console.log(this.pageWrapList)
      let tempList = this.pageWrapList.map(item => {
        let _temp = this.getWrapHeight(item.sort)
        return { ...item, height: _temp.height, top: _temp.top, bottom: _temp.height + _temp.top, mid: 0.5 * _temp.height + _temp.top }
      })
      this.setPageWrapList(tempList)
    },
    reSetList() {
      this.calcPosToLists()
      // console.log(this.operItem)
      if (this.operItem.sort) {
        let newItemOper = this.pageWrapList.find(item => item.id === this.operItem.id)
        this.setOperItem(newItemOper)
      }

      this.dragIndex = null
      this.dropIndex = null
      this.offsetY = null
      this.currenY = null
      this.dragable = true
    },
    changeUp(dragItem = { sort: 4 }, dropItem = { sort: 1 }) {
      // 总高度为 dropItem.top + dropItem.height -dragItem.height
      let dragItemRect = this.getWrapHeight(dragItem.sort)
      let dropItemRect = this.getWrapHeight(dropItem.sort)
      let tempLists = JSON.parse(JSON.stringify(this.pageWrapList))
      let _upHeight = dragItemRect.top - dropItemRect.top
      let changeList = []
      for (let i = 0, len = tempLists.length; i < len; i++) {
        let _tempSort = tempLists[i].sort
        if (_tempSort >= dropItem.sort && _tempSort < dragItem.sort) {
          anime({
            targets: ['#wrap_' + _tempSort],
            translateY: dragItemRect.height,
            duration: 200,
            loop: false
          })
          changeList.push({ sort: _tempSort + 1, id: tempLists[i].id })
        }
      }
      let findItem = tempLists.find(item => item.sort == dragItem.sort)
      changeList.push({ sort: dropItem.sort, id: findItem.id })
      anime({
        targets: ['#wrap_' + dragItem.sort],
        translateY: -_upHeight,
        duration: 200,
        loop: false
      })
      // //this.pageWrapList = tempLists
      setTimeout(() => {
        this.changeData(changeList)
      }, 500)
    },
    changeDown(dragItem = { sort: 1 }, dropItem = { sort: 4 }) {
      // 总高度为 dropItem.top + dropItem.height -dragItem.height
      let dragItemRect = this.getWrapHeight(dragItem.sort)
      let dropItemRect = this.getWrapHeight(dropItem.sort)
      let tempLists = JSON.parse(JSON.stringify(this.pageWrapList))
      let _downHeight = dropItemRect.top + dropItemRect.height - dragItemRect.height - dragItemRect.top
      let changeList = []
      for (let i = 0, len = tempLists.length; i < len; i++) {
        let _tempSort = tempLists[i].sort
        if (_tempSort > dragItem.sort && _tempSort <= dropItem.sort) {
          anime({
            targets: ['#wrap_' + _tempSort],
            translateY: -this.getWrapHeight(dragItem.sort).height,
            duration: 200,
            loop: false
          })
          changeList.push({ sort: _tempSort - 1, id: tempLists[i].id })
        }
      }
      let findItem = tempLists.find(item => item.sort == dragItem.sort)
      changeList.push({ sort: dropItem.sort, id: findItem.id })
      anime({
        targets: ['#wrap_' + dragItem.sort],
        translateY: _downHeight,
        duration: 200,
        loop: false
      })
      //
      //this.pageWrapList = tempLists
      setTimeout(() => {
        // this.pageWrapList = tempLists.sort( ( a, b ) => { return a.sort - b.sort } )
        this.changeData(changeList)
      }, 500)
    },
    changeData(changeList) {
      for (let i = 0, len = this.pageWrapList.length; i < len; i++) {
        this.$refs[`wrap_${this.pageWrapList[i].sort}`][0].style.transform = 'translateY(0px)'
      }
      this.pageWrapList.forEach((wrap, index) => {
        let info = changeList.find(item => item.id == wrap.id)
        if (info) {
          this.$set(this.pageWrapList, index, Object.assign({}, this.pageWrapList[index], { sort: info.sort }))
        }
      })
      let tempList = this.pageWrapList.sort((a, b) => a.sort - b.sort)
      this.setPageWrapList(tempList)
      // 位置改变后需要重新计算位置
      this.reSetList()
    },
    getWrapHeight(sort) {
      if (this.$refs['wrap_' + sort]) {
        let _rect = this.$refs['wrap_' + sort][0].getBoundingClientRect()
        return _rect
      } else {
        return { height: 0, top: 0, bottom: 0 }
      }
    },
    onDragStart(e, item) {
      if (!this.dragable) {
        console.log('dragable...')
        return
      }
      e.dataTransfer.setData('Text', item.sort)
      this.dragIndex = item.sort
      this.offsetY = e.offsetY
      this.enterY = e.clientY
      this.dragable = false
      // e.preventDefault()
    },
    onDragEnter(e, item) {
      if (item.sort === this.dragIndex) {
        return
      }
    },
    onDrop(e, item) {
      e.preventDefault()
    },
    onDragOver(e, item) {
      // 如果不阻止默认的,克隆出来的item会回弹
      e.preventDefault()
    },
    onDrag(e, item) {
      // console.log('onDrag', e)
      // 松开的一瞬间为0
      //e.preventDefault()
      if (e.clientY == 0) {
        return
      }
      if (e.clientY - this.enterY >= 0) {
        // 向下滑动
        console.log('down')
        let findInfo = this.getItemByCurrentTopDown(e.clientY)
        console.log(e.clientY, findInfo)
        if (this.dragIndex != findInfo && this.dragIndex - 1 != findInfo) {
          // if ( this.dragIndex != findInfo ) {
          this.dropIndex = findInfo
        }
      } else {
        console.log('up')
        //向上滑动
        let findInfo = this.getItemByCurrentTopUp(e.clientY)
        if (this.dragIndex != findInfo && this.dragIndex - 1 != findInfo) {
          this.dropIndex = findInfo
        }
      }
    },
    getItemByCurrentTopDown(top, selfSort) {
      for (let i = 0, len = this.pageWrapList.length; i < len; i++) {
        this.currenY = top - this.offsetY
        if (top - this.offsetY <= this.pageWrapList[i].mid) {
          return this.pageWrapList[Math.max(0, i - 1)].sort
        }
      }
      return this.pageWrapList[this.pageWrapList.length - 1].sort
    },
    getItemByCurrentTopUp(top, selfSort) {
      for (let i = this.pageWrapList.length - 1; i >= 0; i--) {
        this.currenY = top - this.offsetY
        if (this.currenY >= this.pageWrapList[i].mid) {
          return this.pageWrapList[i].sort
        }
      }
      return 1
    },
    onDragEnd(e, item) {
      e.preventDefault()
      if (this.dragIndex > this.dropIndex) {
        // 向上移动时,要丢到位置+1
        this.changeUp({ sort: this.dragIndex }, { sort: this.dropIndex + 1 })
      } else {
        this.changeDown({ sort: this.dragIndex }, { sort: this.dropIndex })
      }
      // e.preventDefault()
    },
    addOper() {
      // add item
      let sortMax = { sort: 0 }
      if (this.pageWrapList.length > 0) {
        sortMax = this.pageWrapList.sort((a, b) => b.sort - a.sort)[0]
      }
      const newInfo = {
        id: null,
        info: '',
        pageid: this.pageid,
        sort: sortMax.sort + 1,
        type: 'img',
        url: ''
      }
      this.pageWrapList.push(newInfo)
      let tempList = this.pageWrapList.sort((a, b) => a.sort - b.sort)
      this.setPageWrapList(tempList)
      this.setOperItem(newInfo)
      this.setActiveTab('wrap')
    }
  }
}
</script>
<style scoped>
.wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100%;
}
.wrap .left {
  width: 350px;
  border-right: 1px solid #e3e3e3;
  background: #fff;
}
.wrap .drag-wrap {
  transform: translateY(0);
}
.wrap .drag-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #e3e3e3;
}
.wrap .drag-item.draggable {
  cursor: pointer;
}
.wrap .drag-bar {
  width: 100%;
  height: 1px;
  background: #e3e3e3;
}
.wrap .drag-bar.droping {
  background: #e3e3e3;
  height: 100px;
}
.wrap .draging {
  border: 1px dashed blue;
}

.wrap .right {
  flex: 1;
  background: #fff;
  display: block;
}
.add_oper {
  height: 50px;
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  color: #409eff;
  border: 1px dashed #409eff;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
