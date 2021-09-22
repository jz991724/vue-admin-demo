import TabsView from '@/layouts/tabs/TabsView';
import BlankView from '@/layouts/BlankView';
import PageView from '@/layouts/PageView';

// 路由配置
const options = {
    routes: [
        {
            path: '/login',
            name: '登录页',
            component: () => import('@/pages/login'),
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/exception/403'),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/login',
            children: [
                {
                    path: 'dashboard',
                    name: '分析',
                    meta: {
                        icon: 'dashboard',
                        authority: {
                            role: 'admin'
                        }
                    },
                    component: BlankView,
                    children: [
                        // {
                        //     path: 'workplace',
                        //     name: '工作台',
                        //     meta: {
                        //         page: {
                        //             closable: false
                        //         }
                        //     },
                        //     component: () => import('@/pages/dashboard/workplace'),
                        // },
                        {
                            path: 'analysis',
                            name: '分析页',
                            component: () => import('@/pages/dashboard/analysis/index'),
                        }
                    ]
                },
                // {
                //     path: 'demo',
                //     name: '演示页',
                //     meta: {
                //         icon: 'file-ppt',
                //     },
                //     component: () => import('@/pages/demo'),
                // },
                {
                    path: 'order',
                    name: '订单',
                    meta: {
                        icon: 'form',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'dispatchOrderList',
                            name: '订单派发',
                            component: () => import('@/pages/order/dispatchOrderList'),
                        },
                        {
                            path: 'orderList',
                            name: '订单列表',
                            component: () => import('@/pages/order/orderList'),
                        },
                    ],
                },
                {
                    path: 'personnel',
                    name: '人员',
                    meta: {
                        icon: 'team',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'personnelList',
                            name: '驾驶员',
                            component: () => import('@/pages/personnel/personnelList'),
                        },
                        // {
                        //     path: 'personnelList',
                        //     name: '人员列表',
                        //     component: () => import('@/pages/personnel/personnelList'),
                        // },
                    ],
                },
                {
                    path: 'userManagement',
                    name: '用户管理',
                    meta: {
                        icon: 'team',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'userInfoList',
                            name: '用户列表',
                            component: () => import('@/pages/userManagement/userInfoList'),
                        },
                        // {
                        //     path: 'personnelList',
                        //     name: '人员列表',
                        //     component: () => import('@/pages/personnel/personnelList'),
                        // },
                    ],
                },
                //     {
                //         path: 'parent1',
                //         name: '父级路由1',
                //         meta: {
                //             icon: 'dashboard',
                //         },
                //         component: BlankView,
                //         children: [
                //             {
                //                 path: 'demo1',
                //                 name: '演示页面1',
                //                 component: () => import('@/pages/demo'),
                //             },
                //         ],
                //     },
                //     {
                //         path: 'parent2',
                //         name: '父级路由2',
                //         meta: {
                //             icon: 'form',
                //         },
                //         component: PageView,
                //         children: [
                //             {
                //                 path: 'demo2',
                //                 name: '演示页面2',
                //                 component: () => import('@/pages/demo'),
                //             },
                //         ],
                //     },
                //     {
                //         path: 'exception',
                //         name: '异常页',
                //         meta: {
                //             icon: 'warning',
                //         },
                //         component: BlankView,
                //         children: [
                //             {
                //                 path: '404',
                //                 name: 'Exp404',
                //                 component: () => import('@/pages/exception/404'),
                //             },
                //             {
                //                 path: '403',
                //                 name: 'Exp403',
                //                 component: () => import('@/pages/exception/403'),
                //             },
                //             {
                //                 path: '500',
                //                 name: 'Exp500',
                //                 component: () => import('@/pages/exception/500'),
                //             },
                //         ],
                //     },
                //     {
                //         name: '验权页面',
                //         path: 'auth/demo',
                //         meta: {
                //             icon: 'file-ppt',
                //             authority: {
                //                 permission: 'form',
                //                 role: 'manager',
                //             },
                //             component: () => import('@/pages/demo'),
                //         },
                //     },
            ],
        },
    ],
};

export default options;
