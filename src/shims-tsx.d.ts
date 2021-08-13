import Vue, { VNode } from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        // $router: VueRouter;
        // $route: Route;
        // $store: Store<any>;
        $api: any;
        $bus: any;
        $echarts: any;
        $notification: any;
        $confirm: any;
        $message: any;
    }
}

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {
        }

        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {
        }

        interface IntrinsicElements {
            [elem: string]: any;
        }
    }
}
