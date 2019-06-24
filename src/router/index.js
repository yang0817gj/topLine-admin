import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // 路由的名字，和组件名没关系，说白了就是 path 的别名
      // 好处就是，加入你的 path 是 /x/x/x/x ，我们跳转的时候就可以直接
      // $router.push('/x/x/x/')
      // $router.push({ name: 'xxx' })，不仅仅如此，你就记住，给路由起个名字是一个好的做法
      name: 'login',
      path: '/login',
      // @ 表示 src 目录，无论你当前文件在哪里，@ 都是 src
      component: () => import('@/views/login')
    },
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  if (to.path !== '/login') {
    if (userInfo) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  }
})
export default router
