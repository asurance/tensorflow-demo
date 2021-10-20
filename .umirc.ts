import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: 'tensorflow-demo',
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      name: '手写识别',
    },
  ],
  fastRefresh: {},
  mfsu: {},
  // layout: {
  //   name: 'tensorflow',
  //   logo: 'favicon.png',
  //   navTheme: 'light',
  //   rightContentRender: false,
  // },
});
