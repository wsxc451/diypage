<template>
  <div class="input-runer container">
    <input
      :style="inputStyle"
      type="text"
      class="input-box"
      ref="inputBoxRef"
      :value="timeCount"
      placeholder="请输入"
    >
    <div class="runer" ref="runerRef" id="runerRef"></div>
  </div>
</template>

<script>
// import anime from "animejs/lib/anime.es.js";
export default {
  name: "input-runer",
  props: {
    hasRadius: {
      type: Boolean,// 是否是圆角
      default: true
    },
    width: {
      type: Number,//  
      default: 300
    },
    height: {
      type: Number,//  
      default: 150
    }
  },
  watch: {
    hasRadius( val ) {
      this.initRunInfo()
    }
  },
  data() {
    return {
      startX: 0,
      startY: 0,
      boxWith: 0,
      startTime: 0,
      endTime: 0,
      startCount: 0,
      stepRadius: 0,
      stepBox: 0,
      elInstance: undefined,
      runCount: 0
    };
  },
  computed: {
    timeCount() {
      return this.endTime - this.startTime
    },
    inputStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        borderRadius: this.radius + 'px'
      }
    },
    radius() {
      return this.hasRadius ? this.height * 0.5 : 0
    }
  },
  methods: {
    initRunInfo() {
      let el = this.$refs.runerRef
      this.elInstance = el;
      this.boxWith = el.getBoundingClientRect().width * 0.5
      console.log( 'boxWidth', this.boxWith )
      let inputEl = this.$refs.inputBoxRef;
      let clientInfo = inputEl.getBoundingClientRect()
      console.log( 'clientInfo', clientInfo )
      // this.width = clientInfo.width;
      // this.height = clientInfo.height;
      // this.radius = this.height * 0.5;
      let wBox = this.width * 2 - 4 * this.radius;
      let wRaduis = Math.floor( 2 * Math.PI * this.radius );
      console.log( '00000000', this.width * 2, 4 * this.radius, wBox, wRaduis )
      // 这里如果wBox ==0 ,说明是圆形输入框
      let radiusTime;
      let maxTime = 3000;
      if ( wBox == 0 && this.hasRadius ) {
        radiusTime = maxTime;
      } else if ( wRaduis == 0 ) {
        radiusTime = 0;
      } else {
        radiusTime = ( wRaduis * 100 / ( wBox + wRaduis ) ) * 0.01 * maxTime;
      }

      let boxTime = maxTime - radiusTime;

      let stepLength = 90; // 90度渲染
      let stepTime = radiusTime * 0.25 // 1秒内完成
      this.stepRadius = ( stepTime != 0 ? ( ( 100 * stepLength ) / ( stepTime / 16 ) ) * 0.01 : 0 )//16ms执行一次回调
      let stepBoxLength = this.width - this.radius * 2;
      let stepBoxTime = boxTime * 0.5// 1秒内完成
      this.stepBox = ( stepBoxLength * 100 / ( stepBoxTime / 16 ) ) * 0.01 //16ms执行一次回调
      // if ( this.stepRadius <= 0 ) {
      //   this.stepRadius = this.stepBox
      // }
      //    if(this.stepBox==0){
      //   this.stepBox == this.stepRadius
      // }
      this.startX = -this.boxWith;
      if ( this.hasRadius ) {
        // 如果是由圆角
        this.startY = this.height * 0.5 - this.boxWith;
        this.elInstance.style.transform = 'translate(' + this.startX + 'px' + ',' + this.startY + 'px' + ')'
      } else {
        // 没有圆角
        this.startY = - this.boxWith;
        this.elInstance.style.transform = 'translate(' + this.startX + 'px' + ',' + this.startY + 'px' + ')'
      }
      console.log( wBox, wRaduis, radiusTime, boxTime, stepTime, stepBoxTime )
    },
    runStart() {
      console.log( 'runStart' )
      this.startTime = this.getNowTime()
      this.endTime = this.startTime
      if ( this.hasRadius ) {
        this.initTLPosition( this.elInstance, 0, this.stepRadius )
      } else {
        this.rafRunLToR( this.elInstance, -this.boxWith, this.stepBox )
      }
    },
    rafRunLToR( el, startCount, step ) { // 从左到右
      console.log( startCount )
      if ( startCount >= this.width - this.radius - this.boxWith ) {
        console.log( 'rafRunLToR--End......' )
        if ( this.hasRadius ) {
          this.initTRPosition( el, 0, this.stepRadius )
        } else {
          this.rafRunTRToBR( el, -this.boxWith, this.stepBox )
        }
        return;
      }
      requestAnimationFrame( () => {
        //el.style.left = startCount + 'px'
        let _startX = Math.floor( startCount );
        let _startY = this.boxWith;
        console.log( `translate(${_startX}px,-${_startY}px)` )
        el.style.transform = `translate(${_startX}px,-${_startY}px)`
        this.rafRunLToR( el, startCount + step, step )
      } )

    },
    rafRunTRToBR( el, startCount, step ) { // 从右上到右下
      console.log( startCount )
      if ( startCount >= this.height - this.boxWith ) {
        this.rafRunRToL( el, this.width - this.boxWith, this.stepBox );
        return;
      }
      // 想在一秒内完成最终任务
      // 计算步长
      // 总的长度除以总的次数
      requestAnimationFrame( () => {
        //el.style.left = startCount + 'px'
        let _startX = this.width - this.boxWith;
        let _startY = Math.floor( startCount );
        el.style.transform = `translate(${_startX}px,${_startY}px)`
        this.rafRunTRToBR( el, startCount + step, step )
      } )
    },
    rafRunBLToTL( el, startCount, step ) { // 从左下到右上
      console.log( startCount )
      if ( startCount <= - this.boxWith ) {
        // this.rafRunRToL( el, this.width - this.boxWith, this.stepBox );
        return;
      }
      // 想在一秒内完成最终任务
      // 计算步长
      // 总的长度除以总的次数
      requestAnimationFrame( () => {
        //el.style.left = startCount + 'px'
        let _startX = - this.boxWith;
        let _startY = Math.floor( startCount );
        el.style.transform = `translate(${_startX}px,${_startY}px)`
        this.rafRunBLToTL( el, startCount - step, step )
      } )
    },
    getNowTime() {
      return new Date().getTime()
    },
    rafRunRToL( el, startCount, step ) { // 从右到左
      // console.log( startCount )
      console.log( 'startCount', startCount )
      if ( startCount <= this.radius - this.boxWith ) { // 圆形时
        // this.initBLPosition( el, 0, this.stepRadius )
        if ( this.hasRadius ) {
          this.initBLPosition( el, 0, this.stepRadius )
        } else {
          this.rafRunBLToTL( el, this.height - this.boxWith, this.stepBox )
        }

        return;
      }
      requestAnimationFrame( () => {
        //el.style.left = startCount + 'px'
        let _startX = Math.floor( startCount );
        let _startY = this.height - this.boxWith;
        console.log( `translate(${_startX}px,-${_startY}px)` )
        el.style.transform = `translate(${_startX}px,${_startY}px)`
        this.rafRunRToL( el, startCount - step, step )
      } )
    },
    initTLPosition( el, angele, step ) { // 左上角动画
      // 直角时,不需要旋转
      if ( angele >= 90 ) {
        this.rafRunLToR( el, this.radius, this.stepBox );
        return
      }
      let radius = this.height * 0.5

      let _h = Math.ceil( ( angele == 90 ? 1 : Math.sin( angele * Math.PI / 180 ) ) * radius );
      let _w = Math.ceil( ( angele == 0 ? 1 : Math.cos( angele * Math.PI / 180 ) ) * radius );

      console.log( angele, radius, _h, _w )
      this.startX = this.radius - _w - this.boxWith;
      this.startY = radius - _h - this.boxWith;

      requestAnimationFrame( () => {
        // el.style.left = this.startX + 'px'
        // el.style.top = this.startY + 'px'
        el.style.transform = 'translate(' + this.startX + 'px' + ',' + this.startY + 'px' + ')'
        // console.log( 'initTLPosition----', nowTime - this.startTime )
        this.initTLPosition( el, angele + step, step )
      } )

    },
    initTRPosition( el, angele, step ) { // 右上角动画
      // console.log( 'initTRPosition' )
      // 45du -> 0 du
      console.log( 'initTRPosition', angele )
      if ( step == 0 || angele >= 90 ) {
        this.initBRPosition( el, 0, this.stepRadius )
        return
      }
      let radius = this.radius
      let _h = Math.ceil( Math.cos( angele * Math.PI / 180 ) * radius );
      let _w = Math.ceil( Math.sin( angele * Math.PI / 180 ) * radius );
      let _startX = ( this.width - this.radius ) + _w - this.boxWith;
      let _startY = ( this.radius - _h - this.boxWith );

      requestAnimationFrame( () => {
        // el.style.left = this.startX + 'px'
        // el.style.top = this.startY + 'px'
        console.log( 'translate(' + _startX + 'px' + ',' + _startY + 'px' + ')' )
        el.style.transform = 'translate(' + _startX + 'px' + ',' + _startY + 'px' + ')'
        this.initTRPosition( el, angele + step, step )
      } )
    },
    initBRPosition( el, angele, step ) { // 右下角动画
      if ( step == 0 || angele >= 90 ) {
        this.rafRunRToL( el, this.width - this.radius - this.boxWith, this.stepBox );
        return
      }
      let radius = this.radius
      let _h = Math.ceil( Math.sin( angele * Math.PI / 180 ) * radius );
      let _w = Math.ceil( Math.cos( angele * Math.PI / 180 ) * radius );
      let _startX = ( this.width - this.radius ) + _w - this.boxWith;
      let _startY = ( this.radius + _h - this.boxWith );
      requestAnimationFrame( () => {
        // el.style.left = this.startX + 'px'
        // el.style.top = this.startY + 'px'
        console.log( '---translate(' + _startX + 'px' + ',' + _startY + 'px' + ')' )
        el.style.transform = 'translate(' + _startX + 'px' + ',' + _startY + 'px' + ')'
        this.initBRPosition( el, angele + step, step )
      } )
    },
    initBLPosition( el, angele, step ) { // 左下角动画
      if ( step == 0 || angele >= 90 ) {
        console.log( 'runStartEnd', this.getNowTime() )
        this.endTime = this.getNowTime()
        if ( this.isRun || this.runCount < 3 ) {
          this.runCount = this.runCount + 1
          // this.runStart()
        } else {
          this.isRun = false
        }
        return
      }
      let radius = this.radius
      let _h = Math.ceil( Math.cos( angele * Math.PI / 180 ) * radius );
      let _w = Math.ceil( Math.sin( angele * Math.PI / 180 ) * radius );
      let _startX = ( this.radius - _w ) - this.boxWith;
      let _startY = ( this.radius + _h - this.boxWith );
      requestAnimationFrame( () => {
        // el.style.left = this.startX + 'px'
        // el.style.top = this.startY + 'px'
        el.style.transform = 'translate(' + _startX + 'px' + ',' + _startY + 'px' + ')'
        this.initBLPosition( el, angele + step, step )
      } )
    }

  },
  created() { },
  mounted() {
    this.initRunInfo()
  }
};
</script>

<style scoped>
.input-runer {
  position: relative;
}
.input-box {
  /* height: 200px;
  width: 400px;
  border-radius: 100px; */
  padding: 0 25px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
.runer {
  width: 20px;
  height: 20px;
  position: absolute;

  left: 0px;
  top: 0px;
  background: red;
  border-radius: 50%;
  box-shadow: 0mm;
  z-index: 999;
  transform: translateZ(0);
  -webkit-animation-name: shan666;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
}
@-webkit-keyframes shan666 {
  0% {
    opacity: 0.5;
    box-shadow: 0px 0px 5px #888888;
    /* -webkit-transform: scale(0.8); */
  }
  50% {
    opacity: 1;
    box-shadow: 0px 0px 15px #888888;
    color: #fff;
  }
  100% {
    opacity: 0.5;
    box-shadow: 0px 0px 15px #888888;
    /* -webkit-transform: scale(0.8); */
  }
}
</style>
