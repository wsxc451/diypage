<template>
  <div class="box-grid-item" ref="itemRef" :style="cssObj">{{text}}</div>
</template>

<script>
import anime from 'animejs';
const colors = [
  { value: 0, color: '#009900' },
  { value: 1, color: '#ff3333' },
  { value: 2, color: '#FFC125' }
]
const boxStatus = [
  { value: 0, text: '正常' },
  { value: 1, text: '异常' },
  { value: 2, text: '警告' }
]
export default {
  name: "box-grid-item",
  props: {
    value: {
      type: Object
    },
    bgColor: {
      type: String,
      default: '#FF5500'
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: Number,
      default: 80
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  watch: {
    value: {
      deep: true,
      handler( val ) {
        console.log( val )
        this.renderBox( val )
      }
    }
  },
  computed: {
    cssObj() {
      // let colorInfo = colors.find( item => item.value == this.value.value )
      return {
        background: this.activeColor,
        color: this.color,
        width: this.width,
        height: this.height + 'px'
      }
    }
  },
  data() {
    return {
      activeColor: '',
      text: '',
      isAnimateRuning: false
    };
  },
  mounted() {
    this.activeColor = this.getColor( this.value.value )
    this.text = this.getBoxType( this.value.value )
  },
  methods: {
    getBoxType( value ) {
      return boxStatus.find( item => item.value == value ) || {}
    },
    getColor( value ) {
      let colorInfo = colors.find( item => item.value == value )
      return colorInfo.color
    },
    renderBox( value ) {
      if ( this.isAnimateRuning ) {
        // setTimeout( () => {
        //   this.renderBox( value )
        // }, 2000 );
        return
      }
      anime( {
        targets: this.$refs.itemRef,
        rotateX: '90deg',
        //background: that.getColor( value2 ),
        easing: 'easeInOutQuad',
        direction: 'alternate',
        duration: this.duration * 0.5,
        loop: false,
        complete: ( anim ) => {
          this.activeColor = this.getColor( value.value )
          this.text = this.getBoxType( value.value )
          anime( {
            targets: this.$refs.itemRef,
            //background: that.getColor( value1 ),
            rotateX: '0deg',
            easing: 'easeInOutQuad',
            direction: 'alternate',
            duration: this.duration * 0.5,
            loop: false,
            complete: () => {
              this.isAnimateRuning = false
            }
          } );
        }
      } );

    }
  }
};
</script>

<style scoped>
.box-grid-item {
  display: flex;
  justify-content: center;
  align-content: center;
  justify-self: center;
  align-items: center;
  overflow: hidden;
  line-height: 20px;
}
</style>
