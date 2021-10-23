// vue的mixins
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component({ name: 'VueMixins' })
export default class VueMixins extends Vue {
    moment = moment;

    spinning = false;

    scroll = {
        x: 100,
        y: document.body.clientHeight - 350,
    };

    // 日期格式化
    dateCustomRender(value, format = 'YYYY-MM-DD HH:mm:ss') {
        return this.moment(value)
            .format(format);
    }

    // 时间格式化
    timeCustomRender(value, format = 'HH:mm') {
        return this.moment(value, format)
            .format(format);
    }

    openModal(refName, params?) {
        const modal: any = this.$refs[refName];
        if (modal) {
            modal.openModal(params);
        }
    }

    getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r && 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
