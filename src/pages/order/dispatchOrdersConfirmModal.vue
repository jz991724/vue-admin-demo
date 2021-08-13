/**
* @描述: 派单确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" title="派单确认" @ok="handleDispatchOrder()">
    <a-select show-search
              placeholder="请选择驾驶员"
              option-filter-prop="children"
              style="width: 200px"
              :options="options"
              :filter-option="filterOption"
              v-model="personnelId">
    </a-select>
  </a-modal>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { personnelService, orderService } from '@/services';

@Component({
  name: 'DispatchOrdersConfirmModal',
})
export default class DispatchOrdersConfirmModal extends Vue {
  visible = false;

  personnelId = undefined;

  allDispatchOrderList = [];

  options = [];

  openModal(params = undefined) {
    debugger;
    this.allDispatchOrderList = params || [];
    this.visible = true;
    this.fetchData();
  }

  closeModal() {
    this.visible = false;
  }

  filterOption(input, option) {
    return (
        option.componentOptions.children[0].text.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
  }

  fetchData() {
    personnelService.fetchPersonnelList()
        .then((personnelList = []) => {
          this.options = personnelList.map(({
                                              id,
                                              name,
                                              licenseNumber,
                                            }) => ({
            label: `${name}-${licenseNumber}`,
            value: id,
            key: id,
          }));
        });
  }

  // 派单
  handleDispatchOrder(personnelId = this.personnelId) {
    const orderId = this.allDispatchOrderList.map((id) => id);
    debugger;
    if (personnelId && orderId?.length > 0) {
      debugger;
      orderService.dispatchOrder({
        personnelId,
        orderId,
      })
          .then((res) => {
            debugger;
            this.visible = false;
            this.handleOk();
          });
    }
  }

  @Emit('success')
  handleOk() {
    return true;
  }
}
</script>

<style scoped lang="less">

</style>
