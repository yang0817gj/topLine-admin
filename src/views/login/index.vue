<template>
  <div class="login-warp">
    <div class="login-form-wrap">
      <div class="login-head">
        <!-- 路径 ./ 必须加 -->
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form" :model="loginForm">
          <el-form-item>
            <el-input v-model="loginForm.modile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="10">
              <el-input v-model="loginForm.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加class 会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt.js' // gt.js 会向全局 window 暴露一个函数 initGeetest 处理极验 验证码用的

export default {
  name: 'AppHome',
  data () {
    return {
      loginForm: {
        modile: '13273519987',
        code: ''
      },
      captchaObj: null // 通过initGeetest 的得到极验对象
    }
  },
  methods: {
    onSubmit () {

    },
    handleSendCode () {
      const { modile } = this.loginForm

      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${modile}`
      }).then(res => {
        console.log(res)
        const data = res.data.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          captchaObj.onReady(function () {
            captchaObj.verify()
          }).onSuccess(function () {

          }).onError(function () {
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-warp {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: #ccc;
    background:url(./login_bg.jpg);
    .login-form-wrap {
      background-color: #fff;
      padding: 50px;
      border-radius: 20px;
      .login-head {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        img {
          width: 200px;

        }
      }
      .btn-login {
        width: 100%;
      }
    }
  }
</style>
