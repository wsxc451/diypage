<template>
  <div class="comp2">
    <div v-for="item in lists" :key="item">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: "comp2",
  data() {
    return {
      lists: [1, 2, 3, 4, 5]
    };
  },
  methods: {}
};
</script>

<style scoped>
.comp2 {
  width: 100%;
  background: blue;
  color: #ffffff;
}
</style>
