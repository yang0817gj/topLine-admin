<template>
  <div>
    <div class="box-wrap" @click="dialogVisible = true">
      <p>点击图标选择图片</p>
      <i
        v-if="!imageUrl"
        style="margin-top: 20px;
        font-size: 60px; color: #eee;"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
      <!-- 这是给用户看到的这个已经选好的当前封面 -->
      <img v-else width="120" :src="value">
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="上传图片" name="first">
          <el-upload
            class="avatar-uploader"
            name="image"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="{Authorization: `Bearer ${$store.state.user.token}`}">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="素材库" name="second">配置管理</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEnsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'upload-image',
  props: {
    value: {
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      activeName: 'second',
      imageUrl: ''
    }
  },
  created () {
  },
  methods: {
    handleAvatarSuccess (res, file) {
      // console.log(res)
      this.imageUrl = res.data.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    handleClick (tab, event) {
      console.log(tab, event)
    },

    handleEnsure () {
      this.$emit('input', this.imageUrl)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
