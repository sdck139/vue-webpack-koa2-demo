import Vue from 'vue'

Vue.filter('date', function(val) {
  const fill0 = function(num) {
    if (num < 10) {
      return '0' + num
    }
    return num
  }

  if (!val) {
    return ''
  }

  const date = new Date(val)
  const y = date.getFullYear()
  const m = fill0(date.getMonth() + 1)
  const d = fill0(date.getDate())
  const h = fill0(date.getHours())
  const mi = fill0(date.getMinutes())

  return [y, m, d].join('-') + ' ' + [h, mi].join(':')
})

Vue.filter('br', (value) => {
  return value.replace(/\n/g, '<br>')
})

Vue.filter('toDate', value => {
  return new Date(value)
})

Vue.filter('dateFormat', (value) => {
  return value.toLocaleDateString()
})

Vue.filter('timeFormat', (value) => {
  const fommat = ['日', '一', '二', '三', '四', '五', '六']
  return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate() + ' 星期' + fommat[value.getDay()]
})

Vue.filter('workTime', (value) => {
  const hour = Math.floor(value / 60)
  const minute = value % 60
  return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute)
})

Vue.filter('normalWorkTime', (value) => {
  value = new Date(value)
  const hour = value.getHours()
  const minute = value.getMinutes()
  return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute)
})

Vue.filter('hmFormat', (value) => {
  const hour = value.getHours()
  const minute = value.getMinutes()
  return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute)
})

Vue.filter('decimal', function(val) {
  const int = val.toFixed(2) * 100 / 100
  if (val - int == 0) return val
  else return val.toFixed(2) * 100 / 100
})
