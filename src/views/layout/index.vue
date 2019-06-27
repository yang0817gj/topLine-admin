<template>
  <el-container>
    <el-aside width="200px">
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader></AppHeader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
    .el-aside {
      background-color: #d3dce6;
      .el-menu-vertical-demo {
        height: 100%;
      }
    }
    .el-header {
      background-color: #b3c0d1;
      line-height: 60px;
    }
    .el-main {
      background-color:#e9eef3;
    }
  }
</style>
