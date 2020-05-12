<template>
  <div class="grid-group" :style="styleInfo">
    <gridBox
      :items="datas"
      :column="gridColumn"
      :page="pageNow"
      :row="gridRow"
      :itemHeight="gridItemHeight"
      :itemPadding="gridPadding"
      ref="warpBox"
    >
      <template slot-scope="scope">
        <boxGridItem :value="scope.data" :height="gridItemHeight" class="box-grid-item"></boxGridItem>
      </template>
    </gridBox>
  </div>
</template>

<script>
import anime from 'animejs';
import boxGridItem from '@/components/boxGrid/boxGridItem.vue'
import gridBox from '@/components/gridBox/gridBox.vue'
export default {
  name: "box-grid-group",
  components: {
    boxGridItem,
    gridBox
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    gridColumn: {
      type: Number,
      default: 2
    },
    gridRow: {
      type: Number,
      default: 2
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    gridItemHeight: {
      type: Number,
      default: 100
    },
    gridPadding: {
      type: Number,
      default: 15
    }
  },
  watch: {
    datas( val ) {
      let hasException = val.some( item => item.value == 1 )
      if ( hasException ) {
        //this.changeGroupInfo()
        setTimeout( () => {
          this.activeBgColor = 'rgba(255,48,48,.5)'
        }, 1000 )
      } else {
        this.activeBgColor = 'rgba(255,255,255,.1)'
      }
    }
  },
  computed: {
    styleInfo() {
      return {
        background: this.activeBgColor,
        height: this.boxGroupHeight + 'px'
      }
    }
  },
  data() {
    return {
      datas: [],
      pageNow: 0,
      activeBgColor: 'rgba(255,255,255,.1)',
      isRuning: false,
      boxGroupHeight: 0, // group窗口高度,根据row,col决定窗口高度
      maxPage: 0
    }
  },
  mounted() {
    let boxGroupPadding = this.gridPadding
    let boxGroupColCount = this.gridColumn
    let boxGroupRowCount = this.gridRow // 一个group,2个行,2列
    this.maxPage = Math.floor( this.datas.length / ( boxGroupRowCount * boxGroupColCount ) ) + ( this.datas.length % ( boxGroupRowCount * boxGroupColCount ) == 0 ? 0 : 1 );
    this.boxGroupHeight = this.gridItemHeight * 2 + ( boxGroupRowCount + 1 ) * boxGroupPadding
    setInterval( () => {
      this.pageNow = this.pageNow + 1;
      if ( this.pageNow >= this.maxPage ) {
        this.pageNow = 0
      }
      this.goGroupPage( this.pageNow )
    }, 2000 )
  },
  created() {
    this.initMockData()
    let that = this
    window.onmousewheel = document.onmousewheel = function ( e ) {
      e = e || window.event;
      if ( that.isRuning ) {
        return
      }
      this.isRuning = true
      if ( e.wheelDelta ) { //判断浏览器IE，谷歌滑轮事件               
        if ( e.wheelDelta > 0 ) { //当滑轮向上滚动时  
          that.goUp()
          console.log( "滑轮向上滚动" );
        }
        if ( e.wheelDelta < 0 ) { //当滑轮向下滚动时  
          that.goDown()
          console.log( "滑轮向下滚动333" );
        }
      } else if ( e.detail ) { //Firefox滑轮事件  
        if ( e.detail > 0 ) { //当滑轮向上滚动时  
          that.goUp()
          console.log( "滑轮向上滚动111" );
        }
        if ( e.detail < 0 ) { //当滑轮向下滚动时  
          console.log( "滑轮向下滚动222" );
          that.goDown()
        }
      }
    }
  },
  methods: {
    goGroupPage( page ) {
      console.log( 'goGroupPage', page )
      if ( this.isRuning || page >= this.maxPage || page < 0 ) {
        return
      }
      this.isRuning = true
      let topNext = ( page ) * ( this.boxGroupHeight - this.gridPadding )
      console.log( topNext )
      anime( {
        targets: this.$refs.warpBox.$el,
        top: -topNext + 'px',
        easing: 'easeInOutQuad',
        direction: 'alternate',
        duration: 1000,
        loop: false,
        complete: () => {
          this.isRuning = false
          this.pageNow = page
        }
      } );
    },
    goDown() {
      this.goGroupPage( this.pageNow + 1 )
    },
    goUp() {
      this.goGroupPage( this.pageNow - 1 )
    },
    initMockData() {
      for ( let i = 0; i < 13; i++ ) {
        this.datas.push( {
          id: i,
          width: '48%',
          value: 0,
          height: '80px'
        } )
      }

    }
  }
};
</script>

<style scoped>
.grid-group {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.warp-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-self: center;
  justify-items: center;
  position: absolute;
  top: 0;
}
.box-grid-item {
}
</style>
