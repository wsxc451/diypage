<template>
  <div class="drag-me container">
    <div class="mobile-app" :class="dragWrapClass" ref="mobileRef">
      <DragWrap3
        v-for="wrap in wraps"
        :item="wrap"
        :key="wrap.id"
        :pagePosInfo="pagePosInfo"
        :height="wrap.height || 100"
        :style="{ transform: 'translateY(' + wrap.originTop + 'px)' }"
        class="drag-wrap"
        :bgcolor="wrap.bgcolor"
        :id="'warp_' + wrap.id"
      >
        <div v-if="wrap.component" class="wrap-body">
          <component :is="wrap.component"></component>
        </div>
        <div v-else class="wrap-body">{{ wrap.name }} - {{ wrap.originTop }}</div>
      </DragWrap3>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getRandomColor } from "@/utils.js";
import anime from "animejs/lib/anime.es.js";
import DragWrap3 from "./drag/DragWrap3";
import CompBox from "./CompBox";
import eventBus from "./eventBus";

export default {
  name: "dragMe2",
  components: { DragWrap3, CompBox },
  props: {
    datas: {
      type: Array,
      default: () => {
        return [
          {
            name: "组件1",
            id: 1001,
            height: 100,
            originTop: 0,
            bgcolor: "#e3e3e3"
          },
          {
            name: "组件2",
            id: 1002,
            height: 200,
            originTop: 0,
            bgcolor: "#20a0ff",
            component: "CompBox"
          },
          {
            name: "组件3",
            id: 1003,
            height: 150,
            originTop: 0,
            bgcolor: "yellow"
          },
          {
            name: "组件4",
            id: 1004,
            originTop: 0,
            height: 120,
            bgcolor: "pink"
          }
        ];
      }
    }
  },
  data() {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,
      wrapsEles: [],
      dragWrapClass: [],
      wraps: [],
      pagePosInfo: { left: 0, right: 0, bottom: 0, top: 0, width: 0, height: 0 } // div位置信息,供子类定位作为参考
    };
  },
  methods: {
    getPageInfos() {
      return this.wraps;
    },
    // getOffsetInfo() {
    //   let info = this.$refs.mobileRef;
    //   let boxInfo = info.getBoundingClientRect();
    //   console.log( boxInfo );
    //   console.log( info.scrollTop );
    //   console.log( info.offsetTop );
    // },
    appendItem( $el ) {
      let wrapBox = this.$refs.mobileRef;
      let cloneItem = $el.cloneNode( true );
      cloneItem.style.position = "absolute";
      cloneItem.style.left = 0 + "px";
      cloneItem.style.top = 0 + "px";
      cloneItem.onclick = undefined;
      wrapBox.appendChild( cloneItem );
      return cloneItem;
    },
    removeItem( removeItem ) {
      this.wraps = this.wraps.filter( item => item.id !== removeItem.id );
      this.initWrapsPos( true );
    },
    mouseUp( val ) {
      // 鼠标松开时触发
      let dragItem = val.item;
      let findEles = this.findReplaceNodeByTop( val.top );
      let dragEle = this.wraps.find( item => dragItem.id == item.id );
      let replaceEle = this.wraps.find( item => findEles.id == item.id );
      if ( dragEle.originTop < replaceEle.originTop ) {
        this.dropDown( dragEle, replaceEle, this.wraps );
      } else {
        this.dropUp( dragEle, replaceEle, this.wraps );
      }
    },
    addItem() {
      let maxNode = this.wraps.reduce( ( item1, item2 ) => {
        return item1.id > item2.id ? item1 : item2;
      } );
      console.log( maxNode );
      this.wraps.push( {
        name: "new" + maxNode.id + 1,
        id: maxNode.id + 1,
        height: 120,
        originTop: maxNode.originTop + maxNode.height,
        bgcolor: getRandomColor()
      } );
    },
    dropUp( dragEle, replaceEle, wraps ) {
      console.log( "dragItemUp", dragEle, replaceEle );
      // 下面的元素上移,上移位置
      let changeList = [];
      wraps.forEach( item => {
        if (
          replaceEle.originTop <= item.originTop &&
          item.originTop < dragEle.originTop
        ) {
          let upEleTop = item.originTop + dragEle.height;
          changeList.push( { id: item.id, value: upEleTop } );
          anime( {
            targets: [ "#warp_" + item.id ],
            translateY: upEleTop,
            duration: 1500,
            loop: false
          } );
        }
      } );
      let dragNow = replaceEle.originTop;
      anime( {
        targets: [ "#warp_" + dragEle.id ],
        translateY: dragNow + "px",
        duration: 200,
        loop: false
      } );
      changeList.push( { id: dragEle.id, value: dragNow } );
      this.changeData( changeList );
    },
    dropDown( dragEle, replaceEle, wraps ) {
      let changeList = [];
      wraps.forEach( item => {
        if (
          dragEle.originTop < item.originTop &&
          item.originTop <= replaceEle.originTop
        ) {
          let upEleTop = item.originTop - dragEle.height;
          changeList.push( { id: item.id, value: upEleTop } );
          anime( {
            targets: [ "#warp_" + item.id ],
            translateY: upEleTop,
            duration: 1500,
            loop: false
          } );
        }
      } );
      let dragNow = replaceEle.originTop + replaceEle.height - dragEle.height;
      anime( {
        targets: [ "#warp_" + dragEle.id ],
        translateY: dragNow + "px",
        duration: 200,
        loop: false
      } );
      changeList.push( { id: dragEle.id, value: dragNow } );
      this.changeData( changeList );
    },
    changeData( changeList ) {
      this.wraps.forEach( ( wrap, index ) => {
        let info = changeList.find( item => item.id == wrap.id );
        if ( info ) {
          Vue.set(
            this.wraps,
            index,
            Object.assign( {}, this.wraps[ index ], { originTop: info.value } )
          );
        }
      } );
      this.wraps.sort( ( a, b ) => a.originTop - b.originTop );
    },
    findReplaceNodeByTop( top ) {
      let replaceEle = this.wraps.find(
        item => item.originTop + item.height > top
      );
      // 如果拖到最后面,说明是附加到最后
      if ( !replaceEle ) {
        replaceEle = this.wraps[ this.wraps.length - 1 ];
      }
      return replaceEle;
    },
    initWrapsPos( fresh = false ) {
      let wrapHeight = 0;
      let isNoInited = this.wraps.every( item => item.originTop == 0 );
      console.log( isNoInited );
      if ( isNoInited || fresh ) {
        this.wraps.forEach( ( element, index ) => {
          element.originTop = wrapHeight;
          wrapHeight += this.wraps[ index ].height;
        } );
      }
    },
    compMoveStart( e ) {
      console.log( 'compMove', e )
    },
    compMove( e ) {
      // console.log( 'compMove', e )
    },
    compMoveEnd( e ) {
      // 计算便宜位置top,
      // 计算应该插在那个组件之前
      // 新增元素
      let dropTop = e.top - this.pagePosInfo.top
      console.log( '....', e, dropTop )
      this.insertNodeByTop( e )
      // console.log( 'compMoveEnd', disy, e, eTop - this.pagePosInfo.top )
      // this.wraps.push( { bgcolor: '#ff5500', height: 100, id: 100111, name: 'sxxx', originTop: 0 } )
      // this.initWrapsPos( true );
      // this.dropDown( dragEle, replaceEle, this.wraps );
      // let dragEle = this.wraps.find( item => dragItem.id == item.id );
      // let replaceEle = this.wraps.find( item => findEles.id == item.id );
      // if ( dragEle.originTop < replaceEle.originTop ) {
      //   this.dropDown( dragEle, replaceEle, this.wraps );
      // } else {
      //   this.dropUp( dragEle, replaceEle, this.wraps );
      // }
    },
    insertNodeByTop( e ) {
      // console.log( findEles )
      // 1. 找到这个node
      // 2. 这个node节点以及之后节点都往后移动当前元素高度
      let { top: dropTop, height, bgcolor } = e;
      // let findEles = this.findReplaceNodeByTop( dropTop );
      let changeList = [];
      let newNodeHeight = height;
      let firstChangeNode;
      dropTop -= this.pagePosInfo.top; // 减掉容器的相对top
      console.log( dropTop )
      this.wraps.forEach( ( item, index ) => {
        // 高于item中间线,则区分上下移动

        if ( item.originTop + item.height * 0.5 > dropTop ) {
          if ( !firstChangeNode ) {
            firstChangeNode = item
          }
          console.log( item.originTop, item.height, firstChangeNode )
          let upEleTop = item.originTop + newNodeHeight;
          changeList.push( { id: item.id, value: upEleTop } );
          anime( {
            targets: [ "#warp_" + item.id ],
            translateY: upEleTop,
            duration: 1500,
            loop: false
          } );
        }
      } )
      let maxId = this.wraps.sort( ( item1, item2 ) => item1.id < item2.id )[ 0 ].id || new Date().getTime()
      if ( !firstChangeNode ) { // 如果拖到最后,这里为undefined
        let lastNode = this.wraps.sort( ( item1, item2 ) => item1.originTop < item2.originTop )[ 0 ]
        firstChangeNode = { originTop: lastNode.originTop + lastNode.height }
      }
      this.wraps.push( { bgcolor: bgcolor, height: height, id: maxId + 1, name: '组件' + ( maxId + 1 ), originTop: firstChangeNode.originTop } )
      this.changeData( changeList );
    }
  },
  created() {
    this.wraps = this.datas;
  },
  mounted() {
    this.initWrapsPos();
    console.log( '--', this.$el.getBoundingClientRect() )
    // getBoundingClientRect得到的是DOM对象,需要转出Object
    this.pagePosInfo = JSON.parse( JSON.stringify( this.$el.getBoundingClientRect() ) )
    let elesParent = this.$refs.mobileRef;
    // 屏蔽拖拽式,浏览器复制取词
    elesParent.onselectstart = function () {
      return false;
    };
    eventBus.$on( 'comp-move-start', this.compMoveStart )
    eventBus.$on( 'comp-move-ing', this.compMove )
    eventBus.$on( 'comp-move-end', this.compMoveEnd )
  }
};
</script>

<style scoped>
.drag-me {
  text-align: left;
}
.mobile-app {
  border: 1px solid #b3c0d1;
  height: 800px;
  overflow-x: visible;
  overflow-y: scroll;
  width: 375px;
  position: relative;
}
.drag-wrap {
  transition-duration: 50ms;
}
.wrap-body {
  cursor: default;
  background: #ffffff;
}
</style>
