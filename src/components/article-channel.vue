<template>
  <el-select :value="value" clearable @change="handleUpdate">
    <el-option
      v-for="item in channels"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'article-channel',
  created () {
    this.handleChannels()
  },
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  methods: {
    handleChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        // console.log(data)
        this.channels = data.channels
      }).catch(err => {
        console.log(err)
      })
    },
    handleUpdate (value) {
      // console.log(this.value)
      // console.log(value)
      this.$emit('input', value)
    }
  }
}
</script>

<style>

</style>
