import Vue from 'vue';
import App from './App.vue';
import { initRouter } from './router';
import './theme/index.less';
// eslint-disable-next-line import/order
import Antd from 'ant-design-vue';
// eslint-disable-next-line import/order
import Viser from 'viser-vue';
// import '@/mock';
import store from './store';
import 'animate.css/source/animate.css';
import Plugins from '@/plugins';
import { initI18n } from '@/utils/i18n';
import bootstrap from '@/bootstrap';
import 'moment/locale/zh-cn';
// eslint-disable-next-line import/order
import VeCharts from 've-charts';

// eslint-disable-next-line import/order
import { VueJsonp } from 'vue-jsonp';

Vue.use(VeCharts);

Vue.use(VueJsonp);

Vue.directive('componentPermission', {
// 当被绑定的元素插入到 DOM 中时……
    inserted(el, binding) {
        debugger;
    },
});

const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n('CN', 'US');

Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Viser);
Vue.use(Plugins);

bootstrap({
    router,
    store,
    i18n,
    message: Vue.prototype.$message,
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
