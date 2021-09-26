/**
* @描述: 人员信息详情
* @作者: 张俊
* @创建时间: 2021-09-24 11:53:42
*/
<template>
  <a-modal :title="title"
           :visible="visible"
           v-bind="defaultOptions"
           @ok="handleOk"
           @cancel="handleCancel">
    <a-descriptions bordered :column="2" size="small">
      <template v-for="({label,key,value,span}) in getDescInfo">
        <a-descriptions-item :span="span||1" :key="key">
          <span style="white-space: nowrap;" slot="label">{{ label }}</span>

          <template v-if="key==='status'">
            <a-tag :color="tagColors[value]">{{ PersonnelStatusEnum[value].toString() }}</a-tag>
          </template>
          <template v-else-if="key==='identityCardFront'">
            <image-upload :disabled="true" :value="value | filePathFilter('身份证正面')"></image-upload>
          </template>
          <template v-else-if="key==='identityCardBack'">
            <image-upload :disabled="true" :value="value | filePathFilter('身份证反面')"></image-upload>
          </template>
          <template v-else-if="key==='drivingLicenceFront'">
            <image-upload :disabled="true" :value="value | filePathFilter('驾驶证正页')"></image-upload>
          </template>
          <template v-else-if="key==='drivingLicenceBack'">
            <image-upload :disabled="true" :value="value | filePathFilter('驾驶证副页')"></image-upload>
          </template>
          <template v-else-if="key==='vehicleLicenceFront'">
            <image-upload :disabled="true" :value="value | filePathFilter('行车证正页')"></image-upload>
          </template>
          <template v-else-if="key==='vehicleLicenceBack'">
            <image-upload :disabled="true" :value="value | filePathFilter('行车证副页')"></image-upload>
          </template>
          <template v-else>{{ value || '' }}</template>
        </a-descriptions-item>
      </template>
    </a-descriptions>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Mixins, Emit, Watch,
} from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import ModalMixins from '@/pages/mixins/modalMixins';
import DescInfoBlock from '@/components/desc/DescInfoBlock.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';
import { PersonnelStatusEnum, SexEnum } from '@/services/personnel';

@Component({
  name: 'PersonnelDetailModal',
  components: {
    ImageUpload,
    DescInfoBlock,
  },
  filters: {
    filePathFilter(id, name) {
      return [{
        uid: id,
        name,
        status: 'done',
        url: `http://47.107.108.136:8088/api/File/GetFile?id=${id}`,
      }];
    },
  },
})
export default class PersonnelDetailModal extends Mixins(VueMixins, ModalMixins) {
  title = '驾驶员详情信息';

  detail: any = {};

  PersonnelStatusEnum = PersonnelStatusEnum;

  tagColors = {
    [PersonnelStatusEnum.在职]: 'green',
    [PersonnelStatusEnum.离职]: '',
    [PersonnelStatusEnum.请假]: 'orange',
    [PersonnelStatusEnum.休息]: 'purple',
  };

  get getDescInfo() {
    return [
      {
        label: '姓名',
        key: 'name',
        value: this.detail.name,
      },
      {
        label: '状态',
        key: 'status',
        value: this.detail.status,
      },
      {
        label: '性别',
        key: 'sex',
        value: SexEnum[this.detail.sex],
      },
      {
        label: '电话号码',
        key: 'phoneNumber',
        value: this.detail.phoneNumber,
      },
      {
        label: '入职时间',
        key: 'entryTime',
        value: this.detail.entryTime,
      },
      {
        label: '车牌号',
        key: 'licenseNumber',
        value: this.detail.licenseNumber,
      },
      {
        label: '车型',
        key: 'carType',
        value: this.detail.carType,
      },
      {
        label: '车型分类',
        key: 'vehicleClass',
        value: this.detail.vehicleClass,
      },
      {
        label: '车队',
        key: 'group',
        value: this.detail.group,
      },
      {
        label: '车俩登记时间',
        key: 'carRegisterTime',
        value: this.detail.carRegisterTime,
      },
      {
        label: '住址',
        key: 'address',
        value: this.detail.address,
        span: 2,
      },
      {
        label: '身份证正面',
        key: 'identityCardFront',
        value: this.detail.identityCardFront,
      },
      {
        label: '身份证反面',
        key: 'identityCardBack',
        value: this.detail.identityCardBack,
      },
      {
        label: '驾驶证正页',
        key: 'drivingLicenceFront',
        value: this.detail.drivingLicenceFront,
      },
      {
        label: '驾驶证副页',
        key: 'drivingLicenceBack',
        value: this.detail.drivingLicenceBack,
      },
      {
        label: '行车证正页',
        key: 'vehicleLicenceFront',
        value: this.detail.vehicleLicenceFront,
      },
      {
        label: '行车证副页',
        key: 'vehicleLicenceBack',
        value: this.detail.vehicleLicenceBack,
      },
    ];
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
