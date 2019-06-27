<template>
  <div class="login-warp">
    <div class="login-form-wrap">
      <div class="login-head">
        <!-- 路径 ./ 必须加 -->
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span="10">
              <el-input v-model="loginForm.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col class="seed" :span="6" :offset="2">
              <el-button @click="handleSendCode" :disabled="!!codeTimer || codeLoading">{{ codeTimer ? codeSecons + '后从新发送' : '发送验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="loginForm.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加class 会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import this.$http from 'this.$http'
import '@/vendor/gt.js' // gt.js 会向全局 window 暴露一个函数 initGeetest 处理极验 验证码用的
const initCodeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810',
        agree: ''
      },
      loginLoading: false, // 登录按钮的 loading 状态
      captchaObj: null, // 通过initGeetest 的得到极验对象
      rules: { // 表单验证规则
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { len: 11, message: '手机号长度应为11位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码应为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      codeSecons: initCodeSeconds, // 倒计时的时间
      codeTimer: null, // 倒计时定时器
      sendMobile: '', // 保存初始化验证码之后发送短信的手机号
      codeLoading: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs['loginForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      this.$http({
        method: 'POST',
        url: '/authorizations',
        data: this.loginForm
      }).then(data => { // 200 400 之间
        this.loginLoading = false
        //  element 提供了Message 消息提供组件
        //  这也是组件调用的一种形式
        window.localStorage.setItem('userInfo', JSON.stringify(data))
        this.$message({
          message: '恭喜你，登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch(err => { // 大于400
        if (err.response.status === 400) {
          this.$message.error('登录失败，手机号或者验证码不对')
        }
        this.loginLoading = false
      })
    },
    handleSendCode () {
      this.$refs['loginForm'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {

        }
      })
      if (this.captchaObj) {
        if (this.sendMobile !== this.loginForm.mobile) {
          // 手机号发送改变
          this.sendMobile = null
          document.body.removeChild(document.querySelector('.geetest_panel'))
          this.showGeetest()
        } else {
          this.captchaObj.verify()
        }
      } else {
        this.showGeetest()
      }
    },
    showGeetest () {
      this.codeLoading = true
      this.$http({
        method: 'GET',
        url: `/captchas/${this.loginForm.mobile}`
      }).then(data => {
        // const data = res.data.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          captchaObj.onReady(() => {
            this.sendMobile = this.loginForm.mobile
            captchaObj.verify()
            this.codeLoading = false
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()
            //  调用 获取短信验证码 APL2 接口，发送短信
            this.$http({
              method: 'GET',
              url: `/sms/codes/${this.loginForm.mobile}`,
              params: { // 专门用来传递 qeury 查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(data => {
              this.codeCountDown()
              // console.log(data)
            })
          })
        })
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 55) {
          this.codeSecons = initCodeSeconds // 让倒计时时间回到初始状态
          window.clearInterval(this.codeTimer) // 清除倒计时
          this.codeTimer = null // 清除倒计时定时器的标志
        }
      }, 1000)
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
      .seed {
        width: 100px;
      }
      .btn-login {
        width: 100%;
      }
      .el-checkbox {
        margin-right: 6px;
      }
    }
  }
</style>
