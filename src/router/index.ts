import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/Login',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    noAuth: true,
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            // {
            //     path: '/system-user',
            //     name: 'system-user',
            //     meta: {
            //         title: '用户管理',
            //         permiss: '11',
            //     },
            //     component: () => import(/* webpackChunkName: "system-user" */ '../views/system/user.vue'),
            // },
            // {
            //     path: '/system-role',
            //     name: 'system-role',
            //     meta: {
            //         title: '角色管理',
            //         permiss: '12',
            //     },
            //     component: () => import(/* webpackChunkName: "system-role" */ '../views/system/role.vue'),
            // },
            // {
            //     path: '/system-menu',
            //     name: 'system-menu',
            //     meta: {
            //         title: '菜单管理',
            //         permiss: '13',
            //     },
            //     component: () => import(/* webpackChunkName: "system-menu" */ '../views/system/menu.vue'),
            // },
            {
                path: '/system-course',
                name: 'system-course',
                meta: {
                    title: '实践课程管理',
                    permiss: '16',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/system/course.vue'),
            },
            {
                path: '/system-teacher',
                name: 'system-teacher',
                meta: {
                    title: '教师课题管理',
                    permiss: '17',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/system/teacher.vue'),
            },
            {
                path: '/system-student',
                name: 'system-student',
                meta: {
                    title: '学生选课管理',
                    permiss: '18',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/system/student.vue'),
            },
            {
                path: '/system-tmessage',
                name: 'system-tmessage',
                meta: {
                    title: '教师信息管理',
                    permiss: '19',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/system/tmessage.vue'),
            },
            {
                path: '/system-smessage',
                name: 'system-smessage',
                meta: {
                    title: '学生信息管理',
                    permiss: '20',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/system/smessage.vue'),
            },
            {
                path: '/pages-reset-pwd',
                name: 'pages-reset-pwd',
                meta: {
                    title: '重置密码',
                    permiss: '22',
                },
                component: () => import(/* webpackChunkName: "system-notice" */ '../views/pages/reset-pwd.vue'),
            },
            // {
            //     path: '/system-logviewer',
            //     name: 'system-logviewer',
            //     meta:{
            //         title: '日志查看',
            //         permiss: '15',
            //     },
            //     component: () => import(/* webpackChunkName: "system-logviewer" */ '../views/system/logviewer.vue'),
            // },
            // {
            //     path: '/system-yuyue',
            //     name: 'system-yuyue',
            //     meta: {
            //         title: '预约管理',
            //         permiss: '14',
            //     },
            //     component: () => import(/* webpackChunkName: "system-menu" */ '../views/system/yuyue.vue'),
            // },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '基础表格',
                    permiss: '31',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table/basetable.vue'),
            },
            {
                path: '/table-editor',
                name: 'table-editor',
                meta: {
                    title: '可编辑表格',
                    permiss: '32',
                },
                component: () => import(/* webpackChunkName: "table-editor" */ '../views/table/table-editor.vue'),
            },
            {
                path: '/schart',
                name: 'schart',
                meta: {
                    title: 'schart图表',
                    permiss: '41',
                },
                component: () => import(/* webpackChunkName: "schart" */ '../views/chart/schart.vue'),
            },
            {
                path: '/echarts',
                name: 'echarts',
                meta: {
                    title: 'echarts图表',
                    permiss: '42',
                },
                component: () => import(/* webpackChunkName: "echarts" */ '../views/chart/echarts.vue'),
            },

            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '图标',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/pages/icon.vue'),
            },
            {
                path: '/ucenter',
                name: 'ucenter',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "ucenter" */ '../views/pages/ucenter.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '291',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/pages/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '292',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/pages/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '34',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/table/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '33',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/table/import.vue'),
            },
            {
                path: '/theme',
                name: 'theme',
                meta: {
                    title: '主题设置',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "theme" */ '../views/pages/theme.vue'),
            },
            {
                path: '/calendar',
                name: 'calendar',
                meta: {
                    title: '日历',
                    permiss: '24',
                },
                component: () => import(/* webpackChunkName: "calendar" */ '../views/element/calendar.vue'),
            },
            {
                path: '/watermark',
                name: 'watermark',
                meta: {
                    title: '水印',
                    permiss: '25',
                },
                component: () => import(/* webpackChunkName: "watermark" */ '../views/element/watermark.vue'),
            },
            {
                path: '/carousel',
                name: 'carousel',
                meta: {
                    title: '走马灯',
                    permiss: '23',
                },
                component: () => import(/* webpackChunkName: "carousel" */ '../views/element/carousel.vue'),
            },
            {
                path: '/tour',
                name: 'tour',
                meta: {
                    title: '分步引导',
                    permiss: '26',
                },
                component: () => import(/* webpackChunkName: "tour" */ '../views/element/tour.vue'),
            },
            {
                path: '/steps',
                name: 'steps',
                meta: {
                    title: '步骤条',
                    permiss: '27',
                },
                component: () => import(/* webpackChunkName: "steps" */ '../views/element/steps.vue'),
            },
            {
                path: '/form',
                name: 'forms',
                meta: {
                    title: '表单',
                    permiss: '21',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/element/form.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传',
                    permiss: '22',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/element/upload.vue'),
            },
            {
                path: '/statistic',
                name: 'statistic',
                meta: {
                    title: '统计',
                    permiss: '28',
                },
                component: () => import(/* webpackChunkName: "statistic" */ '../views/element/statistic.vue'),
            },
        ],
    },
    {
        path: '/login',
        meta: {
            title: '登录',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/pages/login.vue'),
    },
    {
        path: '/register',
        meta: {
            title: '注册',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "register" */ '../views/pages/register.vue'),
    },
    // {
    //     path: '/reset-pwd',
    //     meta: {
    //         title: '重置密码',
    //         noAuth: true,
    //     },
    //     component: () => import(/* webpackChunkName: "reset-pwd" */ '../views/pages/reset-pwd.vue'),
    // },
    {
        path: '/403',
        meta: {
            title: '没有权限',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/pages/403.vue'),
    },
    {
        path: '/404',
        meta: {
            title: '找不到页面',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "404" */ '../views/pages/404.vue'),
    },
    { path: '/:path(.*)', redirect: '/404' },
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL), // 设置基础路径
    routes
  });


  router.beforeEach((to, from, next) => {
    //   NProgress.start();
    //   const role = localStorage.getItem('vuems_role');
    //   const permissStore = usePermissStore();
    //   const permissList = permissStore.defaultList;
  
    //   if (!role && to.meta.noAuth !== true) {
    //       next('/login');
    //   } else {
    //       // 检查是否是需要superadmin权限的页面
    //       const isSuperadminPage = to.meta.permiss === '19'|| to.meta.permiss === '20'|| to.meta.permiss === '21';
    //       if (isSuperadminPage) {
    //           // 如果是需要superadmin权限的页面，检查角色是否为superadmin
    //           if (role === 'superadmin') {
    //               next(); // 是superadmin，放行
    //           } else {
    //               next('/403'); // 不是superadmin，跳转到403
    //           }
    //       } else {
    //           next(); // 不是superadmin页面，放行
    //       }
    //   }
    next();
  });

router.afterEach(() => {
    NProgress.done();
});

export default router;
