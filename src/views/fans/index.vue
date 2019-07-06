<template>
  <div>
    <p>粉丝概况 Component</p>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
// 1. npm i echarts
// 2. 在使用的组件中加载 echarts
// 3. 在绘图前我们需要为 ECharts 准备一个具备高宽的 DOM 容器。
// 4. 基于 DOM 容器初始化 echarts

import echarts from 'echarts'

export default {
  name: 'FansOverview',
  data () {
    return {
      myChart: null
    }
  },
  mounted () {
    // 因为 echarts 的初始化要操作 DOM，所以代码写到 mounted 中
    this.initChart()
    this.loadData()
  },
  methods: {
    initChart () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: { // X 轴的数据
          data: []
        },
        yAxis: {}, // y 轴配置项
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      })
    },

    loadData () {
      this.$http({
        method: 'GET',
        url: 'http://localhost:3000/barData'
      }).then(data => {
        console.log(data)
        this.myChart.setOption({
          xAxis: {
            data: data.xAxisData
          },
          series: [{
            // 根据名字对应到相应的系列
            data: data.seriesData
          }]
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
