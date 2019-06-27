<template>
  <div class="articles">
    <el-card class="articles-head">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form :model="statusTypes" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="statusTypes.status">
            <el-radio label="">全部</el-radio>
            <el-radio
              v-for="(item,index) in articleStatus"
              :key="item.label"
              :label="index + ''">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select v-model="statusTypes.channel_id" placeholder="请选择">
            <el-option label="全部频道" value=""></el-option>
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="begin_end_pubdate"
            type="daterange"
            @change="handleUpdataTime"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="article-content">
      <div slot="header" class="clearfix">
        <span>共找到<strong>{{total}}</strong>条符合条件的内容</span>
      </div>
      <el-table
        :data="articles"
        v-loading="articleLoading"
        style="width: 100%">
        <el-table-column
          label="封面"
          width="180">
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]" width="40" />
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <!-- tag组件 -->
            <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        class="fenye"
        :disabled="articleLoading"
        :current-page="page"
        @current-change="handleClick">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'APPArticle',
  created () {
    this.handleShow() // 加载数据
    this.handleChannels() // 加载频道
  },
  data () {
    return {
      articles: [], // 获取数据
      total: 1, // 总数据个数
      articleLoading: false, // 网页加载的时候禁用
      page: 1, // 页数
      // 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除
      articleStatus: [ // 文章状态选项
        {
          label: '草稿',
          type: 'info'
        },
        {
          label: '待审核',
          type: ''
        },
        {
          label: '审核通过',
          type: 'success'
        },
        {
          label: '审核失败',
          type: 'warning'
        },
        {
          label: '已删除',
          type: 'danger'
        }
      ],
      statusTypes: { // 查询状态
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 起始时间
        end_pubdate: '' // 截至时间
      },
      begin_end_pubdate: [], // 时间选择 结果 数组
      channels: '' // 文章频道
    }
  },
  methods: {
    onSubmit () {
      this.page = 1
      this.handleShow()
    },

    // 获取点击分页数
    handleClick (page) {
      this.page = page
      this.articleLoading = true
      this.handleShow(page)
    },

    // 获取数据
    handleShow (page = 1) {
      const query = {}
      // 遍历 如果有值 就添加进query里
      for (var key in this.statusTypes) {
        if (this.statusTypes[key]) {
          query[key] = this.statusTypes[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          ...query
        }
      }).then(data => {
        this.articleLoading = false
        // 设置有多少数据
        this.total = data.total_count
        // 把数据存放在数据里 渲染出来
        this.articles = data.results
      })
    },

    // 删除按钮
    handleDelete (article) {
      console.log(article)
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确定执行
        // 发送删除请求
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          // 重新加载数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => { // 取消执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 时间格式
    handleUpdataTime () {
      // console.log(this.begin_end_pubdate)
      this.statusTypes.begin_pubdate = this.begin_end_pubdate[0]
      this.statusTypes.end_pubdate = this.begin_end_pubdate[1]
    },

    // 获取文章频道
    handleChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .articles-head {
    margin-bottom: 20px;
  }
  .fenye {
    margin-top: 30px;
  }
</style>
