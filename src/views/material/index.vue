<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>卡片名称</span>
    </div>

    <el-radio-group v-model="radio1" @change="handleChange">
      <el-radio-button label="全部" ></el-radio-button>
      <el-radio-button label="收藏" ></el-radio-button>
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
      <el-col ref="abc" :span="4" v-for="(item,index) in loadPhoto" :key="item.id" :offset="index % 5 == 0 ? 0 : 1" class="elCol">
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
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handlePage"
        :total="total_count"
        :page-size="per_page">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'AppMaterial',
  created () {
    this.loadImages(false)
  },
  data () {
    return {
      radio1: '全部',
      loadPhoto: [],
      fileList: '',
      uploadLoding: false,
      total_count: 10,
      page: 1,
      per_page: 0,
      bool: false
    }
  },
  methods: {
    // 加载图片
    async loadImages () {
      try {
        if (this.radio1 === '全部') {
          this.bool = false
        } else {
          this.bool = true
        }
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect: this.bool,
            page: this.page,
            per_page: 5
          }
        })
        this.total_count = data.total_count
        this.per_page = data.per_page
        this.loadPhoto = data.results
      } catch (err) {
        console.log(err)
      }
    },
    handleChange (item) {
      this.page = 1
      this.radio1 = item
      this.loadImages()
    },

    // 收藏或者取消i收藏
    async handleCollect (item) {
      try {
        if (this.loadPhoto[0].id === item.id && this.$refs.abc.length === 1) {
          this.page--
        }
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect: !item.is_collected
          }
        })
        item.is_collected = data.collect
        this.loadImages()
      } catch (err) {
        console.log(err)
      }
    },

    // 删除图片
    handleDel (item) {
      try {
        this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.$message({
          message: '恭喜你，删除成功',
          type: 'success'
        })
        this.loadImages()
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },

    // 图片上传完成
    async handleShow () {
      try {
        this.uploadLoding = false
        this.$message({
          message: '恭喜你，添加成功',
          type: 'success'
        })
        this.loadImages(false)
      } catch (err) {
        console.log(err)
      }
    },

    // 图片上传时
    handleLoading () {
      this.uploadLoding = true
    },

    // 图片上传错误
    uploadError () {
      this.uploadLoding = false
    },

    // 点击更改page
    handlePage (page) {
      this.page = page
      this.loadImages()
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
.block {
  display: flex;
  justify-content: center;
  align-items: center
}
</style>
