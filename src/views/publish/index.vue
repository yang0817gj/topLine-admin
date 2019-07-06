<template>
  <el-card class="box-card">
    <div slot="header">
      <span>发布内容</span>
    </div>
    <el-form :model="publishForm">
      <el-form-item>
        <el-input v-model="publishForm.title" placeholder="文章名称" ></el-input>
      </el-form-item>
      <el-form-item>
        <quill-editor v-model="publishForm.content"
          ref="myQuillEditor"
          :options="editorOption"
          placeholder="请输入内容">
        </quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="publishForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <template v-if="publishForm.cover.type > 0">
          <el-row class="loadphoto" >
            <el-col :span="4" :offset="1" v-for="n in publishForm.cover.type" :key="n">
              <uploadImage v-model="publishForm.cover.images[n-1]"></uploadImage>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="频道">
        <article-channel v-model="publishForm.channel_id"></article-channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleArticle(false)">发表</el-button>
        <el-button @click="handleArticle(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' // 富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ArticleChannel from '@/components/article-channel'
import uploadImage from './components/upload-image'
export default {
  name: 'AppPublish',
  components: {
    quillEditor,
    ArticleChannel,
    uploadImage
  },
  data () {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: 1
      },
      editorOption: {}

    }
  },
  methods: {
    handleArticle (draft) {
      try {
        this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.publishForm
        })
        this.$router.push({
          name: 'article'
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less">

  .loadphoto {
    margin-top: 20px;
  }
  .box-wrap {
    width: 200px;
    height: 200px;
    border: 1px solid #eee;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>
