/**
* @描述: 订单详情
* @作者: 张俊
* @创建时间: 2021-09-24 11:53:42
*/
<template>
  <a-modal :title="title"
           :visible="visible"
           v-bind="defaultOptions"
           @ok="handleOk"
           @cancel="handleCancel">
    <desc-info-block :desc-info="getDescInfo" :bordered="true"></desc-info-block>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Mixins, Emit, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import VueMixins from '@/pages/mixins/vueMixins';
import ModalMixins from '@/pages/mixins/modalMixins';
import { orderService } from '@/services';
import CUpload from '@/components/file/cUpload.vue';
import FileUpload from '@/components/file/ImageUpload.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';
import ChoiceAddressBlock from '@/pages/order/choiceAddressBlock.vue';
import DescInfoBlock from '@/components/desc/DescInfoBlock.vue';

@Component({
  name: 'OrderDetailModal',
  components: { DescInfoBlock },
})
export default class OrderDetailModal extends Mixins(VueMixins, ModalMixins) {
  title = '订单详情信息';

  detail: any = {};

  get getDescInfo() {
    return [
      {
        key: 'orderNumber',
        value: this.detail.orderNumber,
        label: '订单号',
      },
      {
        key: 'channel',
        value: this.detail.channel,
        label: '渠道',
      },
      {
        key: 'passengerName',
        value: this.detail.passengerName,
        label: '乘客姓名',
      },
      {
        key: 'passengerPhone',
        value: this.detail.passengerPhone,
        label: '乘客电话',
      },
      {
        key: 'useCarDate',
        value: this.detail.useCarDate,
        label: '用车日期',
      },
      {
        key: 'flightTime',
        value: this.detail.flightTime,
        label: '航班时间',
      },
      {
        key: 'useCarTime',
        value: this.detail.useCarTime,
        label: '用车时间',
      },
      {
        key: 'productType',
        value: this.detail.productType,
        label: '产品类型',
      },
      {
        key: 'flightNumber',
        value: this.detail.flightNumber,
        label: '车型',
      },
      {
        key: 'carType',
        value: this.detail.carType,
        label: '航班车次号',
      },
      {
        key: 'startAddress',
        value: this.detail.startAddress,
        label: '上车地点',
        span: 2,
      },
      {
        key: 'destinationAddress',
        value: this.detail.destinationAddress,
        label: '下车地点',
        span: 2,
      },
      {
        key: 'reservationDepartment',
        value: this.detail.reservationDepartment,
        label: '预定部门',
      },
      {
        key: 'customerName',
        value: this.detail.customerName,
        label: '客户名称',
      },
      {
        key: 'amountPayable',
        value: this.detail.amountPayable,
        label: '采购应付金额（元）',
      },
      {
        key: 'settlementPrice',
        value: this.detail.settlementPrice,
        label: '结算价格（元）',
      },
      {
        key: 'reservationPeople',
        value: this.detail.reservationPeople,
        label: '预订人',
      },
      {
        key: 'motorcade',
        value: this.detail.motorcade,
        label: '车队',
      },
      {
        key: 'remark',
        value: this.detail.remark,
        label: '备注',
      }];
  }

  // 打开modal
  openModal(detail = undefined) {
    if (detail) {
      this.open();

      this.detail = detail;
    }
  }
}
</script>

<style scoped>

</style>
