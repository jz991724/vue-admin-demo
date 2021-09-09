// vue的mixins
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component({ name: 'VueMixins' })
export default class VueMixins extends Vue {
    moment = moment;

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
}
