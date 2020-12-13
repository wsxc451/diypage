<template>
  <div class="wrap">
    <div class="left">
      <div
        class="drag-wrap"
        v-for="(item) in lists"
        :key="item.sort"
        :id="`wrap_${item.sort}`"
        :ref="`wrap_${item.sort}`"
      >
        <!-- <div
          v-if="index==0"
          :class="{droping:(item.sort == dragIndex)}"
          class="drag-bar"
          @dragenter="(e)=>{onDragEnter(e,item)}"
          @dragleave="(e)=>{onDragLeave(e,item)}"
          @drop="(e)=>{onDrop(e,item)}"
        ></div>-->
        <!-- <div v-if="index==0" :class="{droping:dropIndex==0}" class="drag-bar">0</div> -->
        <div
          class="drag-item"
          :class="{draging:(item.sort == dragIndex),draggable:dragable}"
          :draggable="dragable"
          @dragstart="(e)=>onDragStart(e,item)"
          @dragend="(e)=>onDragEnd(e,item)"
          @dragenter="(e)=>{onDragEnter(e,item)}"
          @drag="(e)=>{onDragOver(e,item)}"
        >
          {{item.id}} --
          {{item.name}}--
          {{item.sort}}--
          t:{{item.top}}--
          mid:{{item.mid}}
        </div>
        <div class="drag-bar" :class="{droping:dropIndex==item.sort}">{{item.sort}}</div>
      </div>
    </div>
    <div class="right">
      curentY:{{ currenY}}
      <br>
      dragIndex: {{dragIndex}}
      <br>
      dropIndex: {{dropIndex}}
      <br>
    </div>
  </div>
</template>
<script>
import anime from "animejs/lib/anime.es.js";
export default {
  name: 'Diy',
  data() {
    return {
      lists: [],
      dragIndex: null,
      dragItem: {},
      dropIndex: null,
      dragable: false,
      enterY: null,
      offsetY: null,
      currenY: null,
      lastY: null
    }
  },
  mounted() {
    this.lists = [
      { id: 11, name: '11111', type: 'item', sort: 1 },
      { id: 21, name: '22222', type: 'item', sort: 2 },
      { id: 31, name: '33333', type: 'item', sort: 3 },
      { id: 41, name: '44444', type: 'item', sort: 4 }
    ]
    setTimeout( () => {
      this.calcPosToLists()
      this.dragable = true
    }, 300 );
  },
  methods: {
    calcPosToLists() {
      this.lists = this.lists.map( item => {
        let _temp = this.getWrapHeight( item.sort )
        return { ...item, height: _temp.height, top: _temp.top, bottom: _temp.height + _temp.top, mid: 0.5 * _temp.height + _temp.top }
      } )
    },
    changeUp( dragItem = { sort: 4 }, dropItem = { sort: 1 } ) {
      // 总高度为 dropItem.top + dropItem.height -dragItem.height
      let dragItemRect = this.getWrapHeight( dragItem.sort )
      let dropItemRect = this.getWrapHeight( dropItem.sort )
      let tempLists = JSON.parse( JSON.stringify( this.lists ) )
      let _upHeight = dragItemRect.top - dropItemRect.top
      let changeList = []
      for ( let i = 0, len = tempLists.length; i < len; i++ ) {
        let _tempSort = tempLists[ i ].sort
        if ( _tempSort >= dropItem.sort && _tempSort < dragItem.sort ) {
          anime( {
            targets: [ "#wrap_" + _tempSort ],
            translateY: dragItemRect.height,
            duration: 200,
            loop: false
          } );
          changeList.push( { sort: _tempSort + 1, id: tempLists[ i ].id } );
        }
      }
      let findItem = tempLists.find( item => item.sort == dragItem.sort )
      changeList.push( { sort: dropItem.sort, id: findItem.id } );
      anime( {
        targets: [ "#wrap_" + dragItem.sort ],
        translateY: -_upHeight,
        duration: 200,
        loop: false
      } );
      // //this.lists = tempLists
      setTimeout( () => {
        this.changeData( changeList )
      }, 500 );
    },
    changeDown( dragItem = { sort: 1 }, dropItem = { sort: 4 } ) {
      // 总高度为 dropItem.top + dropItem.height -dragItem.height
      let dragItemRect = this.getWrapHeight( dragItem.sort )
      let dropItemRect = this.getWrapHeight( dropItem.sort )
      let tempLists = JSON.parse( JSON.stringify( this.lists ) )
      let _downHeight = dropItemRect.top + dropItemRect.height - dragItemRect.height - dragItemRect.top
      let changeList = []
      for ( let i = 0, len = tempLists.length; i < len; i++ ) {
        let _tempSort = tempLists[ i ].sort
        if ( _tempSort > dragItem.sort && _tempSort <= dropItem.sort ) {
          anime( {
            targets: [ "#wrap_" + _tempSort ],
            translateY: -this.getWrapHeight( dragItem.sort ).height,
            duration: 200,
            loop: false
          } );
          changeList.push( { sort: _tempSort - 1, id: tempLists[ i ].id } );
        }
      }
      let findItem = tempLists.find( item => item.sort == dragItem.sort )
      changeList.push( { sort: dropItem.sort, id: findItem.id } );
      anime( {
        targets: [ "#wrap_" + dragItem.sort ],
        translateY: _downHeight,
        duration: 200,
        loop: false
      } );
      //
      //this.lists = tempLists
      setTimeout( () => {
        // this.lists = tempLists.sort( ( a, b ) => { return a.sort - b.sort } )
        this.changeData( changeList )
      }, 500 );
    },
    changeData( changeList ) {
      for ( let i = 0, len = this.lists.length; i < len; i++ ) {
        this.$refs[ `wrap_${this.lists[ i ].sort}` ][ 0 ].style.transform = 'translateY(0px)'
      }
      this.lists.forEach( ( wrap, index ) => {
        let info = changeList.find( item => item.id == wrap.id );
        if ( info ) {
          this.$set(
            this.lists,
            index,
            Object.assign( {}, this.lists[ index ], { sort: info.sort } )
          );
        }
      } );
      this.lists = this.lists.sort( ( a, b ) => a.sort - b.sort );
      this.dragable = true
    },
    getWrapHeight( sort ) {
      if ( this.$refs[ "wrap_" + sort ] ) {
        let _rect = this.$refs[ "wrap_" + sort ][ 0 ].getBoundingClientRect()
        return _rect
      } else {
        return { height: 0, top: 0 }
      }
    },
    onDragStart( e, item ) {
      if ( !this.dragable ) {
        console.log( 'dragable...' )
        return
      }
      e.dataTransfer.setData( 'Text', item.sort )
      this.dragIndex = item.sort
      this.dragItem = item
      this.offsetY = e.offsetY
      this.enterY = e.clientY
      this.lastY = e.clientY
      this.dragable = false
      // e.preventDefault()
    },
    onDragEnter( e, item ) {
      if ( item.sort === this.dragIndex ) {
        return
      }
    },
    onDragOver( e, item ) {
      // 松开的一瞬间为0
      if ( e.clientY == 0 ) {
        return
      }
      if ( e.clientY - this.enterY >= 0 ) {
        console.error( 'up to down' )
        let findInfo = this.getItemByCurrentTop( e.clientY )
        // console.log( findInfo )
        if ( this.dragIndex != findInfo && this.dragIndex - 1 != findInfo ) {
          this.dropIndex = findInfo
        }
      } else {
        console.error( 'downa to up', e )
        let findInfo = this.getItemByCurrentTopUp( e.clientY )
        if ( this.dragIndex != findInfo && this.dragIndex - 1 != findInfo ) {
          this.dropIndex = findInfo
        }
      }
    },
    getItemByCurrentTop( top, selfSort ) {
      for ( let i = 0, len = this.lists.length; i < len; i++ ) {
        this.currenY = top - this.offsetY
        if ( top - this.offsetY <= this.lists[ i ].mid ) {
          return this.lists[ Math.max( 0, i - 1 ) ].sort
        }
      }
      return this.lists[ this.lists.length - 1 ].sort
    },
    getItemByCurrentTopUp( top, selfSort ) {
      for ( let i = this.lists.length - 1; i >= 0; i-- ) {
        this.currenY = top - this.offsetY
        if ( this.currenY >= this.lists[ i ].mid ) {
          return this.lists[ i ].sort
        }
      }
      return 1
    },
    onDragLeave( e, item ) {
      console.log( e )
      //e.target.style.height = '5px'
      //this.dropIndex = null
    },
    onDragEnd( e, item ) {
      // if ( this.dropIndex == null ) {
      //   this.dropIndex = this.lists.length + 1
      // }
      if ( this.dragIndex > this.dropIndex ) {
        // 向上移动时,要丢到位置+1
        this.changeUp( { sort: this.dragIndex }, { sort: this.dropIndex + 1 } )
      } else {
        this.changeDown( { sort: this.dragIndex }, { sort: this.dropIndex } )
      }

      this.dragIndex = null
      this.dropIndex = null
      this.offsetY = null
    },
    onDrop( e, item ) {
      console.log( 'onDrop', e )
      event.preventDefault();
      var data = event.dataTransfer.getData( "Text" );
      console.log( data )
    },
    resetList() {

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
  height: 80px;
  border-bottom: 1px solid #e3e3e3;
}
.wrap .drag-item.draggable {
  cursor: move;
}
.wrap .drag-bar {
  width: 100%;
  height: 15px;
  line-height: 15px;
  background: #e3e3e3;
}
.wrap .drag-bar.droping {
  background: red;
}
.wrap .draging {
  border: 1px dashed blue;
}
</style>
