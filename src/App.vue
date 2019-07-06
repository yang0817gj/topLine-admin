<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  #app {
    height: 100%;
  }
  [v-cloak] {
    display: none
  }
</style>
