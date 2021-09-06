// vue的mixins
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component({ name: 'VueMixins' })
export default class VueMixins extends Vue {
    moment = moment;

    openModal(refName, params?) {
        const modal: any = this.$refs[refName];
        if (modal) {
            modal.openModal(params);
        }
    }
}
