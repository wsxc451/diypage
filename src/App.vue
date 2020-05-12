<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
    };
  },
  mounted() {
  },
  created() {
  },
  methods: {

  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
