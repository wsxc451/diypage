<template>
  <div class="index">
    <Diy />
  </div>
</template>

<script>
import boxGridGroup from '@/components/boxGrid/boxGridGroup.vue'
import Diy from '../diy/diy'
export default {
  name: 'dashboard',
  components: {
    boxGridGroup,
    Diy
  },
  data() {
    return {
      datas: []
    }
  },
  mounted() {
    // this.initMockData()
  },
  created() {},
  methods: {
    changeDown() {}
    // changeBox( index ) {
    //   console.log( index )
    //   let { value } = this.datas[ index ]
    //   this.$set( this.datas, index, Object.assign( {}, this.datas[ index ], { value: ( value + 1 ) % 3 } ) )
    // },
    // getBoxType( value ) {
    //   return boxStatus.find( item => item.value == value ) || {}
    // },
    // initMockData() {
    //   for ( let i = 0; i < 13; i++ ) {
    //     this.datas.push( {
    //       id: i,
    //       width: '48%',
    //       value: 0,
    //       height: '80px'
    //     } )
    //   }
    // }
  }
}
</script>

<style scoped>
.index {
  /* position: absolute;
  left: 0;
  top: 0; */
  box-sizing: border-box;
}
</style>
