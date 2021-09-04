/**
 * @描述: modal的mixins
 * @作者: 张俊
 * @创建时间: 2021-06-02 08:56:11
 */
import { Component, Vue } from 'vue-property-decorator';

@Component({ name: 'ModalMixins' })
export default class ModalMixins extends Vue {
    visible = false;

    confirmLoading = false;

    spinning = false;

    // 默认配置参数
    defaultOptions = {
        destroyOnClose: true,
        width: 800,
        mask: true,
        // dialogStyle: {
        //     // left: '20px',
        //     // top: '130px',
        //     // margin: 0,
        //     // top: '60px',
        // },
        // getContainer: () => this?.$parent?.$el?.children?.[0],
        bodyStyle: {
            maxHeight: 'calc(100vh - 225px)',
            overflow: 'auto',
        },
        // maskStyle: {
        //     position: 'absolute',
        // },
        // wrapClassName: 'modalWrap_getContainer',
        footer: null,
    };

    // openModal() {
    //     this.open();
    // }

    open() {
        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    // 确定操作
    handleOk() {
        debugger;
    }

    // 取消操作
    handleCancel() {
        this.close();
    }
}
