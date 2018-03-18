<template>
  <div>{{msg}}</div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    this.$http
      .get('hello')
      .then((res) => {
        this.msg = res.data.msg
      })
  }
}
</script>
<style lang="stylus">
</style>
