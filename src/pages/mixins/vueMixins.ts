// vue的mixins
import { Component, Vue } from 'vue-property-decorator';

@Component({ name: 'VueMixins' })
export default class VueMixins extends Vue {
    openModal(refName, params?) {
        const modal: any = this.$refs[refName];
        if (modal) {
            modal.openModal(params);
        }
    }
}
