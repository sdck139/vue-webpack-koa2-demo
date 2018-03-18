import Vue from 'vue'

Vue.directive('press', {
  bind(el, binding) {
    const timeout = 750
    let task

    el.addEventListener('mousedown', () => {
      task = setTimeout(() => {
        const param = {}
        for (let key in binding.value) {
          if (key != 'callback') {
            param[key] = binding.value[key]
          }
        }
        if (typeof binding.value.callback == 'function') {
          binding.value.callback(param)
        }
      }, timeout)
    })

    el.addEventListener('mouseup', () => {
      clearTimeout(task)
    })
  }
})
