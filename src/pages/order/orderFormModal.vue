/**
* @描述:订单的编辑及添加
* @作者: 张俊
* @创建时间: 2021-08-27 03:36:08
*/
<template>
  <a-modal :title="title"
           :visible="visible"
           v-bind="defaultOptions"
           :afterClose="afterClose"
           @ok="handleOk"
           @cancel="handleCancel">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <a-form-model-item label="渠道" prop="channel">
          <a-input v-model="form.channel"/>
        </a-form-model-item>

        <a-form-model-item label="乘客姓名" prop="passengerName">
          <a-input v-model="form.passengerName"/>
        </a-form-model-item>

        <a-form-model-item label="用车日期" prop="useCarDate">
          <a-date-picker v-model="form.useCarDate"
                         type="date"
                         placeholder="请选择用车日期"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="用车时间" prop="useCarTime">
          <a-time-picker v-model="form.useCarTime"
                         placeholder="请选择用车时间"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="航班时间" prop="flightTime">
          <a-date-picker v-model="form.flightTime"
                         type="date"
                         placeholder="请选择航班时间"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="航班车次号" prop="flightNumber">
          <a-input v-model="form.flightNumber"/>
        </a-form-model-item>

        <a-form-model-item label="上车地点" prop="start">
          <choice-address-block v-model="form.start" map-id="startAddressMap"></choice-address-block>
        </a-form-model-item>

        <a-form-model-item label="下车地点" prop="destination">
          <choice-address-block v-model="form.destination" map-id="destinationAddressMap"></choice-address-block>
        </a-form-model-item>

        <a-form-model-item label="预定部门" prop="reservationDepartment">
          <a-input v-model="form.reservationDepartment"/>
        </a-form-model-item>

        <a-form-model-item label="客户名称" prop="customerName">
          <a-input v-model="form.customerName"/>
        </a-form-model-item>

        <a-form-model-item label="采购应付金额" prop="amountPayable">
          <a-input type="number" v-model="form.amountPayable"/>
        </a-form-model-item>

        <a-form-model-item label="结算价格" prop="settlementPrice">
          <a-input type="number" v-model="form.settlementPrice"/>
        </a-form-model-item>

        <a-form-model-item label="预订人" prop="reservationPeople">
          <a-input v-model="form.reservationPeople"/>
        </a-form-model-item>

        <a-form-model-item label="乘客电话" prop="passengerPhone">
          <a-input v-model="form.passengerPhone"/>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Mixins, Emit, Watch,
} from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import ModalMixins from '@/pages/mixins/modalMixins';
import { orderService } from '@/services';
import CUpload from '@/components/file/cUpload.vue';
import FileUpload from '@/components/file/ImageUpload.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';
import ChoiceAddressBlock from '@/pages/order/choiceAddressBlock.vue';

@Component({
  name: 'AddPersonnelForm',
  components: {
    ChoiceAddressBlock,
    ImageUpload,
    FileUpload,
    CUpload,
  },
})
export default class AddPersonnelForm extends Mixins(VueMixins, ModalMixins) {
  title = '订单信息添加';

  labelCol = { span: 4 };

  wrapperCol = { span: 20 };

  isEdit = false;

  form: any = {
    channel: undefined,
    passengerName: undefined,
    useCarDate: undefined,
    flightTime: undefined,
    useCarTime: undefined,
    flightNumber: undefined,
    start: undefined,
    destination: undefined,
    reservationDepartment: undefined,
    customerName: undefined,
    amountPayable: undefined,
    settlementPrice: undefined,
    reservationPeople: undefined,
    passengerPhone: undefined,
  };

  rules = {
    channel: [{
      required: true,
      message: '请输入渠道',
      trigger: 'blur',
    }],
    passengerPhone: [{
      required: true,
      message: '请输入电话号码',
      trigger: 'blur',
    }, {
      pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
      message: '请输入正确的电话号码',
      trigger: 'change',
    }],
    useCarDate: [{
      required: true,
      message: '请选择用车日期',
      trigger: 'change',
    }],
    useCarTime: [{
      required: true,
      message: '请选择用车时间',
      trigger: 'change',
    }],
    start: [{
      required: true,
      message: '请输入上车地点',
      trigger: 'blur',
    }],
    destination: [{
      required: true,
      message: '请输入下车地点',
      trigger: 'blur',
    }],
  };

  // 打开modal
  openModal(info = undefined) {
    this.open();
    this.$nextTick(() => {
      if (info) {
        this.isEdit = true;
        this.title = '订单信息编辑';
        this.form = { ...info };
      } else {
        this.isEdit = false;
        this.title = '订单信息添加';
      }
    });
  }

  // 提交
  onSubmit() {
    const { ruleForm }: any = this.$refs;
    ruleForm.validate((valid) => {
      if (valid) {
        const {
          start,
          destination,
        } = this.form;

        this.form = {
          ...this.form,
          startAddress: start.address,
          startLngLat: Object.values(start.location)
              .join(','),
          destinationLngLat: Object.values(destination.location)
              .join(','),
          destinationAddress: destination.address,
        };

        if (this.isEdit) {
          orderService.updateOrder(this.form)
              .then((res) => {
                this.$message.success('订单信息更新成功！');
                this.emitSubmitSuccess(res);
                this.close();
              });
        } else {
          orderService.addOrder(this.form)
              .then((res) => {
                this.$message.success('订单信息提交成功！');
                this.emitSubmitSuccess(res);
                this.close();
              }, (error) => {
                this.$message.error('订单信息提交失败！');
                this.emitSubmitFail();
              });
        }
      }
    });
  }

  // 重置
  resetForm() {
    const { ruleForm }: any = this.$refs;
    ruleForm.resetFields();
  }

  afterClose() {
    this.resetForm();
  }

  // onChoiceAddress() {
  //
  // }

  @Emit('submitSuccess')
  emitSubmitSuccess(info = undefined) {
    return info;
  }

  @Emit('submitFail')
  emitSubmitFail(info = undefined) {
    return info;
  }
}
</script>

<style scoped>

</style>
