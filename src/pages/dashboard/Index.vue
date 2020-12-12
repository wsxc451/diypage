<template>
  <div class="index">div</div>
</template>

<script>
const boxStatus = [
  { value: 0, text: '异常' },
  { value: 1, text: '正常' },
  { value: 2, text: '警告' }
]
import boxGridGroup from '@/components/boxGrid/boxGridGroup.vue'
export default {
  name: "dashboard",
  components: {
    boxGridGroup
  },
  data() {
    return {
      datas: []
    }
  },
  mounted() {
    this.initMockData()
    let index = 0;
    // this.changeBox( index )
    // index++;
    setInterval( () => {
      this.changeBox( index )
      index++;
      if ( index >= this.datas.length ) {
        index = 0
      }
    }, 3000 );
  },
  created() {

  },
  methods: {
    changeBox( index ) {
      console.log( index )
      let { value } = this.datas[ index ]
      this.$set( this.datas, index, Object.assign( {}, this.datas[ index ], { value: ( value + 1 ) % 3 } ) )
    },
    getBoxType( value ) {
      return boxStatus.find( item => item.value == value ) || {}
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
.index {
  position: absolute;
  background: rgba(0, 0, 0);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
