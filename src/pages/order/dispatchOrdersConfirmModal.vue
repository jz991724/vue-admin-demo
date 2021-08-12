/**
* @描述: 派单确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" title="派单确认" @ok="handleOk">
    <pre>{{ allDispatchOrderList }}</pre>
  </a-modal>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { orderService } from '@/services';

@Component({
  name: 'DispatchOrdersConfirmModal',
})
export default class DispatchOrdersConfirmModal extends Vue {
  visible = false;

  selectedKey = undefined;

  allDispatchOrderList = [];

  openModal(params = undefined) {
    debugger;
    this.allDispatchOrderList = params || [];
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  @Emit('handleOk')
  handleOk() {
    this.visible = false;
    return this.selectedKey;
  }
}
</script>

<style scoped lang="less">

</style>
