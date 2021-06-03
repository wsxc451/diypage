<template>
  <div class="page-wrap" id="storeMapMore-id">
    <div style="margin-top: 50px">
      <!-- {{ isScrollTop }} -- {{ innerCanScroll }} -->
      <!-- <van-switch v-model="wrapCanScroll" />
      <van-switch v-model="innerCanScroll" /> -->
    </div>
    <div class="drag-wrap" id="drag-wrap" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <div style="width: 100%; height: 50px; line-height: 50px; text-align: center">bar-item</div>
      <scroll :can-scroll="innerCanScroll" @scrollEnd="scrollEnd" @scrollTop="scrollTop">
        <div class="innerbody">
          <ul>
            <li v-for="i in 50" :key="i">{{ i }}</li>
          </ul>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import scroll from './scroll'
// import { Switch } from 'vant'
export default {
  components: {
    // [Switch.name]: Switch,
    scroll,
  },
  data() {
    return {
      show: false,
      thirdList: [],
      innerEl: undefined,
      wrapEl: undefined,
      dragEl: undefined,
      startY: 0,
      distanceY: 0,
      isDraging: false,
      isDragDown: false,
      clientHeight: 0,
      innerCanScroll: false,
      wrapCanScroll: true,
      debFnScrollTop: undefined,
      debFnScrollDown: undefined,
      isScrollTop: false,
      dragEnvInfo: {
        startY: 0,
        dissY: 0,
      },
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.wrapEl = document.getElementById('drag-wrap')
    this.innerEl = document.getElementById('drag-wrap-inner')
    this.clientHeight = document.getElementById('storeMapMore-id').getBoundingClientRect().height
  },
  methods: {
    touchStart(e) {
      console.log('touchStart', e)
      let pageY = e.touches[0].clientY
      let wrapTop = this.wrapEl.getBoundingClientRect().top
      this.distanceY = pageY - wrapTop
      this.dragEnvInfo.startY = pageY
    },
    touchMove(e) {
      // this.wrapInfo.currentTop = e.targetTouches[0].clientY
      let pageY = e.touches[0].clientY
      this.dragEnvInfo.dissY = pageY - this.dragEnvInfo.startY
      if (this.wrapCanScroll) {
        this.wrapEl.style.top = e.targetTouches[0].clientY - this.distanceY + 'px'
        e.preventDefault()
      } else {
        // e.preventDefault()
      }
    },
    changeStatus(valWrap, valInner) {
      this.innerCanScroll = valInner
      this.wrapCanScroll = valWrap
    },
    touchEnd(e) {
      console.log('touchEnd', e)
      let wrapTop = this.wrapEl.getBoundingClientRect().top
      console.log(this.wrapCanScroll)

      if (this.dragEnvInfo.dissY < 0) {
        this.wrapCanScroll = false
        this.innerCanScroll = true
        this.dragStop(15)
      } else if (this.dragEnvInfo.dissY > 0) {
        this.wrapCanScroll = true
        this.innerCanScroll = false
        this.dragStop(65)
      }

      this.dragEnvInfo.startY = 0
    },
    scrollTop(params) {
      this.innerCanScroll = false
      this.isScrollTop = true
      console.log('scrollTop', params)
      //
    },
    scrollEnd(params) {
      console.log('scrollEnd', params)
    },

    dragStop(topNum) {
      // animejs(this.dragWrap,'')
      anime({
        targets: this.wrapEl,
        top: topNum + 'vh',
        duration: 100,
        easing: 'easeInOutSine',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.page-wrap {
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: #fff;
  position: absolute;
}
.innerbody {
  background: #e3e3e3;
}
.drag-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  top: 300px;
  right: 0;
  background: #eeeeee;
  .drag-wrap-inner {
    overflow-x: hidden;
    overflow-y: auto;
    background: #333;
    height: 480px;
    margin-top: 40px;
    ul {
      background: #fff;
      text-align: center;
      li {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e3e3e3;
      }
    }
  }
}
</style>