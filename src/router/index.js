import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use( VueRouter )

export const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import( '@/pages/home/Index.vue' ),
    children: [
      {
        path: '/',
        redirect: '/index/dashboard'
      },
      {
        path: 'home',
        component: () => import( '@/pages/home/Home.vue' ),
      },
      {
        path: 'dashboard',
        component: () => import( '@/pages/dashboard/Index.vue' ),
      }
    ]
  }
]

const router = new VueRouter( { routes } )

// // 全局路由守卫
// router.beforeEach( ( to, from, next ) => {
//   // const nextRoute = [ '/callback', '/logout', '/login', '/silent', '/ssologin', '/home', '/helloworld' ] // 不需要登录的页面
//   // let isLogin = isLogined()
//   // // 未登录状态；当路由到 nextRoute 指定页时，跳转至 UserLogIn
//   // if ( nextRoute.indexOf( to.path ) >= 0 ) { // 检测是否登录的页面
//   //   if ( to.path === logoutPage && isLogin ) {
//   //     next( '/home' )
//   //   } else {
//   //     next()
//   //   }
//   // } else {
//   //   if ( !isLogin ) {
//   //     sessionStorage.setItem( 'loginReturn', to.fullPath )
//   //     router.push( { path: '/ssologin' } )
//   //   } else {
//   //     next()
//   //   }
//   // }
// } )
export default router