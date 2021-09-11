/**
* @描述: 导出数据确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" :destroyOnClose="true" title="导入数据确认" @ok="handleOk()">
    <a-row :gutter="10">
      <a-col :span="12">
        <a-select :options="conditionsOptions.channel"
                  v-model="conditions.channel"
                  style="width: 200px;"
                  placeholder="请选择渠道"></a-select>
      </a-col>

      <a-col :span="12">
        <a-select :options="conditionsOptions.years"
                  v-model="conditions.years"
                  style="width: 200px;"
                  placeholder="请选择年度"></a-select>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { orderService } from '@/services';

@Component({
  name: 'ExportDataConfirmModal',
})
export default class ExportDataConfirmModal extends Vue {
  visible = false;

  conditionsOptions = {
    years: [],
    channel: [],
  };

  conditions = {
    channel: undefined,
    year: undefined,
  };

  openModal(params = undefined) {
    this.visible = true;
    this.$nextTick(() => {
      this.fetchConditionsOptions();
    });
  }

  closeModal() {
    this.visible = false;
  }

  // 获取筛选条件下拉需要的options
  fetchConditionsOptions() {
    Promise.all([orderService.fetchChannelList(), orderService.fetchYearList()])
        .then(([channelOptions, yearOptions]) => {
          this.conditionsOptions.channel = channelOptions.filter((item) => !!item)
              .map((value) => ({
                title: value,
                value,
              }));

          this.conditionsOptions.years = yearOptions.filter((item) => !!item)
              .map((value) => ({
                title: value,
                value,
              }));
        });
  }

  // 导出
  exportOrderByExcel(fileName = '导出数据.xlsx', params = this.conditions) {
    orderService.exportOrderList(fileName, params);
  }

  // 确定
  @Emit('confirm')
  handleOk() {
    debugger;
    this.exportOrderByExcel();
    this.closeModal();
  }
}
</script>

<style scoped lang="less">

</style>
