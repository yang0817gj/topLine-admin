<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-col :span="8">
      <el-form>
        <el-form-item label="媒体名称">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体简介">
          <el-input v-model="userInfo.intro"></el-input>
        </el-form-item>
        <el-form-item label="头条号ID">
          <el-input :value="userInfo.id && userInfo.id + ''" disabled></el-input>
        </el-form-item>
        <el-form-item label="绑定手机">
          <el-input :value="userInfo.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate">保持更新</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4" :offset="2">
      <!-- :http-request="handlephoto" -->
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :http-request="handlephoto"
        :before-upload="beforeAvatarUpload">
        <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-col>
  </el-card>
</template>

<script>
export default {
  name: 'AppAccount',
  created () {
    this.handleprofile()
  },
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    handleprofile () {
      this.$http({
        method: 'GET',
        url: '/user/profile'
      }).then(data => {
        this.userInfo = data
      })
    },

    handleUpdate () {
      const { name, intro, email } = this.userInfo
      // console.log(name,intro,email)
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name,
          intro,
          email
        }
      }).then(data => {
        this.$store.commit('changeUser', data)
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
    },

    handleAvatarSuccess (res, file) {
      this.userInfo.photo = URL.createObjectURL(file.raw)
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

    handlephoto (item) {
      const photo = new FormData()
      photo.append('photo', item.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: photo
      }).then(data => {
        this.userInfo.photo = data.photo
        this.$store.commit('changeUser', {
          photo: data.photo
        })
      })
    }
  }
}
</script>

<style lang="less" >
  .avatar-uploader .el-upload {
    border: 1px dashed #666;
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
