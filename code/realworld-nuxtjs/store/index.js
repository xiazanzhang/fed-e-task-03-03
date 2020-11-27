const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行的都是一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  }
}

export const actions = {
  // 特殊的 actions 方法 会在服务端渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    let user = null
    // 判断请求头中是否有 cookie
    if (req.headers.cookie) {
      // 使用 cookieparser 把 cookie字符串转化为 JavaScript 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}