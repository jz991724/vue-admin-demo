/**
* @描述: 订单详情
* @作者: 张俊
* @创建时间: 2021-09-24 11:53:42
*/
<template>
  <a-modal :title="title"
           :visible="visible"
           v-bind="defaultOptions"
           :afterClose="afterClose"
           @ok="handleOk"
           @cancel="handleCancel">
    <desc-info-block :desc-info="descInfo"></desc-info-block>
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

  descInfo: any = [{
    key: 'orderNumber',
    value: undefined,
    label: '',
  },
    {
      key: 'channel',
      value: undefined,
      label: '',
    },
    {
      key: 'passengerName',
      value: undefined,
      label: '',
    },
    {
      key: 'passengerPhone',
      value: undefined,
      label: '',
    },
    {
      key: 'useCarDate',
      value: undefined,
      label: '',
    },
    {
      key: 'flightTime',
      value: undefined,
      label: '',
    },
    {
      key: 'useCarTime',
      value: undefined,
      label: '',
    },
    {
      key: 'productType',
      value: undefined,
      label: '',
    },
    {
      key: 'flightNumber',
      value: undefined,
      label: '',
    },
    {
      key: 'carType',
      value: undefined,
      label: '',
    },
    {
      key: 'start',
      value: undefined,
      label: '',
    },
    {
      key: 'destination',
      value: undefined,
      label: '',
    },
    {
      key: 'reservationDepartment',
      value: undefined,
      label: '',
    },
    {
      key: 'customerName',
      value: undefined,
      label: '',
    },
    {
      key: 'amountPayable',
      value: undefined,
      label: '',
    },
    {
      key: 'settlementPrice',
      value: undefined,
      label: '',
    },
    {
      key: 'reservationPeople',
      value: undefined,
      label: '',
    },
    {
      key: 'motorcade',
      value: undefined,
      label: '',
    },
    {
      key: 'remark',
      value: undefined,
      label: '',
    }];

  // 打开modal
  openModal(info = undefined) {
    // 数据格式化
    const formatData = () => {
      let {
        destinationLngLat,
        startLngLat,
      } = info;

      const {
        destinationAddress,
        startAddress,
      } = info;

      const start = {
        location: undefined,
        address: startAddress,
      };

      const destination = {
        location: undefined,
        address: destinationAddress,
      };

      if (startLngLat) {
        startLngLat = startLngLat.split(',');
        start.location = {
          lat: startLngLat[0],
          lng: startLngLat[1],
        };
      }

      if (destinationLngLat) {
        destinationLngLat = destinationLngLat.split(',');

        destination.location = {
          lat: destinationLngLat[0],
          lng: destinationLngLat[1],
        };
      }

      return {
        ...info,
        start,
        destination,
      };
    };

    this.open();
    // this.$nextTick(() => {
    //   if (info) {
    //     this.isEdit = true;
    //     this.title = '订单信息编辑';
    //     this.form = formatData();
    //   }
    // });
  }
}
</script>

<style scoped>

</style>
