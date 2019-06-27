<template>
  <el-row>
    <el-col :span="12"><div class="grid-content bg-purple">江苏传智播客教育科技股份有限公司</div></el-col>
    <el-col :span="4" :offset="8"><div class="grid-content bg-purple-light">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="userInfo.photo" />
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>git地址</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div></el-col>
  </el-row>
</template>

<script>
export default {
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  },
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .bg-purple-light {
    float: right;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    img {
      width: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
