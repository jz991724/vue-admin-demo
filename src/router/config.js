import TabsView from '@/layouts/tabs/TabsView';
import BlankView from '@/layouts/BlankView';

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
                    component: BlankView,
                    meta: {
                        icon: 'dashboard',
                        authority: {
                            role: ['admin', 'dispatcher']
                        }
                    },
                    children: [
                        {
                            path: 'analysis',
                            name: '分析页',
                            meta: {
                                authority: {
                                    role: ['admin', 'dispatcher']
                                }
                            },
                            component: () => import('@/pages/dashboard/analysis/index'),
                        }
                    ]
                },
                {
                    path: 'order',
                    name: '订单',
                    meta: {
                        icon: 'form',
                        authority: {
                            role: ['admin', 'dispatcher']
                        }
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'dispatchOrderList',
                            name: '订单派发',
                            meta: {
                                authority: {
                                    role: ['admin', 'dispatcher']
                                }
                            },
                            component: () => import('@/pages/order/dispatchOrderList'),
                        },
                        {
                            path: 'orderList',
                            name: '订单列表',
                            meta: {
                                authority: {
                                    role: ['admin', 'dispatcher']
                                }
                            },
                            component: () => import('@/pages/order/orderList'),
                        },
                    ],
                },
                {
                    path: 'personnel',
                    name: '人员',
                    meta: {
                        icon: 'team',
                        authority: {
                            role: ['admin', 'dispatcher']
                        }
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'personnelList',
                            name: '驾驶员',
                            meta: {
                                authority: {
                                    role: ['admin', 'dispatcher']
                                }
                            },
                            component: () => import('@/pages/personnel/personnelList'),
                        },
                    ],
                },
                {
                    path: 'userManagement',
                    name: '用户管理',
                    meta: {
                        icon: 'team',
                        authority: {
                            role: ['admin']
                        }
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'userInfoList',
                            name: '用户列表',
                            meta: {
                                authority: {
                                    role: ['admin']
                                }
                            },
                            component: () => import('@/pages/userManagement/userInfoList'),
                        },
                    ],
                },
            ],
        },
    ],
};

export default options;
