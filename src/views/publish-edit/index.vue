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
        <el-radio-group v-model="publishForm.cover">
          <el-radio label="单图"></el-radio>
          <el-radio label="三图"></el-radio>
          <el-radio label="无图"></el-radio>
          <el-radio label="自动"></el-radio>
        </el-radio-group>
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
export default {
  name: 'AppPublish',
  components: {
    quillEditor,
    ArticleChannel
  },
  created () {
    this.handleLoadActicle()
  },
  data () {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: ['http://toutiao.meiduo.site/FrPkPk9sKlIzM0pYJ__bY4UphWEe']
        },
        channel_id: 1
      },
      editorOption: {}
    }
  },
  methods: {
    handleArticle (draft) {
      this.$http({
        method: 'POST',
        url: '/articles',
        params: {
          draft
        },
        data: this.publishForm
      }).then(() => {
        this.$router.push({
          name: 'article'
        })
      })
    },

    handleLoadActicle () {
      const id = this.$route.params.id
      this.$http({
        method: 'GET',
        url: `/articles/${id}`
      }).then(data => {
        console.log(data)
        this.publishForm = data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
