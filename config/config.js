// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              path: '/user/login',
              name: 'login',
              component: './User/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout', //******关键在这里
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              Routes: ['src/pages/Authorized'],
              authority: ['admin', 'adminSuper', 'adminProduct', 'adminOrder'],
              routes: [
                {
                  path: '/',
                  redirect: '/account/settings',
                },
                {
                  name: 'account',
                  icon: 'user',
                  path: '/account',
                  authority: ['admin', 'adminSuper', 'adminProduct', 'adminOrder'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/account/settings',
                    },
                    {
                      name: 'settings',
                      icon: 'smile',
                      path: '/account/settings',
                      component: './account/settings',
                    },
                  ],
                },
                {
                  path: '/product',
                  name: 'product',
                  icon: 'shopping',
                  authority: ['adminSuper', 'adminProduct'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/product/product-list',
                    },
                    {
                      name: 'list',
                      path: '/product/product-list',
                      component: './product/product-list',
                    },
                    {
                      name: 'add',
                      path: '/product/product-add',
                      component: './product/product-add',
                    },
                    {
                      name: 'category',
                      path: '/product/product-category',
                      component: './product/product-category',
                    },
                  ],
                },
                {
                  path: '/order',
                  name: 'order',
                  icon: 'Bars',
                  authority: ['adminSuper', 'adminOrder'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/order/order-list',
                    },
                    {
                      name: 'list',
                      icon: 'smile',
                      path: '/order/order-list',
                      component: './order/order-list',
                    },
                    {
                      name: 'wait',
                      path: '/order/order-wait',
                      component: './order/order-wait',
                    },
                    {
                      name: 'delivery',
                      path: '/order/order-delivery',
                      component: './order/order-delivery',
                    },
                  ],
                },
                {
                  path: '/member',
                  name: 'member',
                  icon: 'user',
                  authority: ['adminSuper'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/member/member-list',
                    },
                    {
                      name: 'list',
                      icon: 'smile',
                      path: '/member/member-list',
                      component: './member/member-list',
                    },
                  ],
                },
                {
                  path: '/auth',
                  name: 'auth',
                  icon: 'Safety',
                  authority: ['adminSuper'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/auth/auth-list',
                    },
                    {
                      name: 'list',
                      icon: 'smile',
                      path: '/auth/auth-list',
                      component: './auth/auth-list',
                    },
                  ],
                },
                {
                  component: '404',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
