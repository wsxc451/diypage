<template>
  <div class="scroll-wrap" ref="scrollWrap" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
    <!-- <div class="fix-info">
      {{ wrapInfo }}
    </div> -->
    <div class="scroll-wrap-inner" ref="scrollWrapInner">
      <slot> slot -default </slot>
    </div>
  </div>
</template>

<script>
import { Switch } from 'vant'
export default {
  components: {
    [Switch.name]: Switch,
  },
  props: {
    canScroll: {
      type: Boolean,
      default: true,
    },
    wrapCanScroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isCanScroll: true,
      wrapEl: undefined,
      wrapInfo: {
        clientHeight: 0,
        bodyHeight: 0,
        bottom: 0,
        currentTop: 0,
        diffY: 0,
      },
      debFnScrollTop: undefined,
      debFnScrollDown: undefined,
      diffY: 0,
      dragStartY: 0,
    }
  },
  watch: {
    // ['wrapInfo.diffY'](val) {
    //   console.log('diffY', val)
    // },
  },
  created() {
    this.debFnScrollTop = this.debounce(this.scrollTop, 500, true)
    this.debFnScrollEnd = this.debounce(this.scrollEnd, 500, true)
  },
  mounted() {
    this.wrapEl = this.$refs.scrollWrap
    this.wrapInfo.clientHeight = this.$refs.scrollWrap.getBoundingClientRect().height
    this.wrapInfo.bodyHeight = this.$refs.scrollWrapInner.getBoundingClientRect().height
  },
  methods: {
    touchStart(e) {
      console.log('touchStart', e)
      if (!this.canScroll) {
        e.preventDefault()
      } else {
        console.log(this.$refs.scrollWrap.scrollTop)
        this.dragStartY = e.touches[0].clientY
      }
    },
    touchMove(e) {
      // this.wrapInfo.currentTop = e.targetTouches[0].clientY
      let _Y = e.touches[0].clientY
      this.wrapInfo.diffY = this.dragStartY - _Y
      //  console.log(this.canScroll)
      if (!this.canScroll) {
        e.preventDefault()
      } else {
        // console.log('touchMove', e)
        this.wrapInfo.currentTop = this.$refs.scrollWrap.scrollTop + this.wrapInfo.clientHeight
        if (this.wrapInfo.currentTop >= this.wrapInfo.bodyHeight - 10) {
          this.debFnScrollEnd()
        } else if (this.wrapInfo.currentTop <= this.wrapInfo.clientHeight) {
          console.log('debFnScrollTop', this.wrapInfo.currentTop, this.canScroll)
          this.debFnScrollTop()
        }
      }
    },
    touchEnd(e) {
      this.wrapInfo.diffY = 0
    },

    debounce(func, wait, immediate = true) {
      let timeout
      return function () {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
          var callNow = !timeout
          timeout = setTimeout(() => {
            timeout = null
          }, wait)
          if (callNow) func.apply(context, args)
        } else {
          timeout = setTimeout(function () {
            func.apply(context, args)
          }, wait)
        }
      }
    },
    scrollTop() {
      if (this.wrapInfo.diffY < -5) {
        this.changeWrapStatus(true, false)
      }
      this.$emit('scrollTop', {})
    },
    changeWrapStatus(val) {
      this.$parent.changeStatus(val)
    },
    scrollEnd() {
      this.$emit('scrollEnd', {})
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-wrap {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.fix-info {
  position: fixed;
  left: 0px;
  top: 0;
  width: 100%;
  background: #fff;
}
</style>