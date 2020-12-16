import Vue from 'vue'
Vue.directive('limiting', {
  inserted(el, binding, vnode) {
    const mask = document.createElement('div')
    if (!['absolute', 'fixed', 'sticky'].includes(el.style.position)) {
      el.style.position = 'relative'
    }
    let styleStr = ['position:absolute', 'left:0', 'right:0', 'top:0', 'bottom:0', 'z-index:2']
    mask.style = styleStr.join(';')
    el.appendChild(mask)
    const { arg = 'click', value } = binding

    let __isCalling = false
    const finish = () => {
      __isCalling = false
      mask.style = styleStr.join(';')
    }
    el.__limiteFn = e => {
      let disabled = el.getAttribute('disabled')
      // 如果disabled禁用,则直接跳过
      if (disabled) {
        return
      }
      e.stopPropagation()
      if (!__isCalling) {
        __isCalling = true
        try {
          mask.style = styleStr.concat(['background:rgba(255,255,255,.3)', 'cursor:wait']).join(';')
          let result = el[arg]()
          if (!value && result instanceof Promise) {
            result.then(finish, finish)
          } else {
            setTimeout(finish, value || 3000)
          }
        } catch (e) {
          setTimeout(finish, value || 3000)
        }
      }
    }
    mask.addEventListener(arg, el.__limiteFn)
  }
})
