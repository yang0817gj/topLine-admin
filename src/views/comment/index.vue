<template>
  <el-card>
    <div slot="header">
      <span>评论管理</span>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="500">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        width="200"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        width="300"
        label="粉丝数">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            :disabled = "scope.row.loading"
            @change="handleChangeStatus(scope.row)"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fenye"
      background
      :disabled="loading"
      @current-change="handlefenye"
      layout="prev, pager, next"
      :total="total_count">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'AppComment',
  created () {
    this.handleShow()
  },
  data () {
    return {
      tableData: [],
      total_count: 0,
      page: 1,
      loading: false
    }
  },
  methods: {
    // 获取数据
    handleShow (page = 1) {
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          response_type: 'comment',
          page
        }
      }).then(data => {
        this.loading = false
        data.results.forEach(item => {
          item.loading = false
        })
        this.total_count = data.total_count
        this.tableData = data.results
      })
    },

    handleChangeStatus (item) {
      // console.log(item)
      item.loading = true
      this.$http({
        method: 'PUT',
        url: '/comments/status',
        params: {
          article_id: item.id + ''
        },
        data: {
          allow_comment: item.comment_status
        }
      }).then(() => {
        item.loading = false
      }).catch(err => {
        console.log(err)
        item.loading = false
        item.comment_status = !item.comment_status
      })
    },

    handlefenye (page) {
      this.loading = true
      console.log(page)
      this.page = page
      this.handleShow(page)
    }
  }
}
</script>

<style lang="less" scoped>
  .fenye {
    margin-top: 30px;
  }
</style>
