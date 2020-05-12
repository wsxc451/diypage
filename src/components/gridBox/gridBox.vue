<template>
  <div class="grid-wrap" ref="itemRef" :style="{height:maxHeight+'px'}">
    <div class="grid-wrap-item" v-for="(item,index) in items" :key="index" :style="cssObj">
      <slot :data="item">{{item}}</slot>
    </div>
    <div class="clear" :style="{height:itemPadding+'px'}"></div>
  </div>
</template>

<script>
import anime from 'animejs';

export default {
  name: "grid-box",
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    column: {
      type: Number,
      default: 1
    },
    row: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    itemHeight: {
      type: Number,
      default: 50
    },
    itemPadding: {
      type: Number,
      default: 15
    },
    page: {
      type: Number,
      default: 0
    }
  },
  watch: {

  },
  computed: {
    cssObj() {
      // let colorInfo = colors.find( item => item.value == this.value.value )
      return {
        marginLeft: this.itemPadding + 'px',
        marginTop: this.itemPadding + 'px',
        width: ( ( ( this.boxWrapWidth - ( this.column + 1 ) * this.itemPadding ) ) * 100 / this.column ) * 0.01 + 'px' // 计算每个列单元格宽度,减去padding
      }
    },
    maxHeight() {
      let height = 0
      let maxPage = Math.floor( this.items.length / ( this.row * this.column ) ) + ( this.items.length % ( this.row * this.column ) == 0 ? 0 : 1 );
      console.log( 'maxPage', maxPage )
      height = ( ( this.itemPadding + this.itemHeight ) * this.row ) * maxPage
      return height
    }
  },
  data() {
    return {
      activeColor: '',
      text: '',
      isAnimateRuning: false,
      boxWrapWidth: 0,
      currentPage: 0,
      maxPage: 0
    };
  },
  mounted() {
    let info = this.$refs.itemRef && this.$refs.itemRef.getBoundingClientRect()
    console.log( info )
    this.boxWrapWidth = info && info.width || 0
  },
  methods: {
    getCurrentPage() {
      return this.currentPage
    }
  }
};
</script>

<style scoped>
.grid-wrap {
  display: block;
  position: relative;
  line-height: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.grid-wrap-item {
  display: block;
  float: left;
}
.clear {
  width: 100%;
  clear: both;
}
</style>
