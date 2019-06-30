<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>卡片名称</span>
    </div>

    <el-radio-group v-model="radio1">
      <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
      <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
    </el-radio-group>
    <el-upload
      action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
      :show-file-list="false"
      name="image"
      :on-progress="handleLoading"
      style="float:right"
      :disabled="uploadLoding"
      :on-error="uploadError"
      :on-success="handleShow"
      :headers="{
        Authorization: `Bearer ${$store.state.user.token}`
      }">
      <el-button size="small" type="primary">{{!uploadLoding ? '点击上传' : '正在上传中'}}</el-button>
    </el-upload>
    <el-row>
      <el-col :span="4" v-for="(item,index) in loadPhoto" :key="item.id" :offset="index % 5 == 0 ? 0 : 1" class="elCol">
        <el-card :body-style="{ padding: '0px' }" :offset="2">
          <img :src="item.url" class="image">
          <div style="padding: 14px;">
            <div class="bottom clearfix">
              <el-button type="warning" @click="handleCollect(item)" :icon="item.is_collected ?'el-icon-star-on' : 'el-icon-star-off' " circle></el-button>
              <el-button type="danger" @click="handleDel(item)" icon="el-icon-delete" circle></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AppMaterial',
  created () {
    this.loadImages()
  },
  data () {
    return {
      radio1: '全部',
      loadPhoto: [],
      collect: false,
      fileList: '',
      uploadLoding: false
    }
  },
  methods: {
    loadImages (collect) {
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          collect
        }
      }).then(data => {
        this.loadPhoto = data.results
      })
    },

    handleCollect (item) {
      this.$http({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collected
        }
      }).then(data => {
        item.is_collected = data.collect
      })
    },

    handleDel (item) {
      this.$http({
        method: 'DELETE',
        url: `/user/images/${item.id}`
      }).then(data => {
        this.$message({
          message: '恭喜你，删除成功',
          type: 'success'
        })
        this.loadImages()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },

    handleShow () {
      this.uploadLoding = false
      this.$message({
        message: '恭喜你，添加成功',
        type: 'success'
      })
      this.loadImages()
    },

    handleLoading () {
      // console.log(11)
      this.uploadLoding = true
    },

    uploadError () {
      this.uploadLoding = false
    }
  }
}
</script>

<style scoped lang="less">
.bottom {
  display: flex;
  justify-content: center;
  align-items: center
}
.image {
  width: 100%;
  height: 200px;
}
.el-radio-group {
  margin-bottom: 20px;
}
.elCol {
  margin-bottom: 30px;
}
</style>
