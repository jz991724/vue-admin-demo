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
        <a-form-model-item label="订单号" prop="orderNumber">
          <a-input v-model="form.orderNumber" placeholder="请输入订单号"/>
        </a-form-model-item>

        <a-form-model-item label="渠道" prop="channel">
          <a-input v-model="form.channel" placeholder="请输入渠道"/>
        </a-form-model-item>

        <a-form-model-item label="乘客姓名" prop="passengerName">
          <a-input v-model="form.passengerName" placeholder="请输入乘客姓名"/>
        </a-form-model-item>

        <a-form-model-item label="乘客电话" prop="passengerPhone">
          <a-input v-model="form.passengerPhone" placeholder="请输入乘客电话"/>
        </a-form-model-item>

        <a-form-model-item label="用车日期" prop="useCarDate">
          <a-date-picker v-model="form.useCarDate"
                         type="date"
                         format="YYYY-MM-DD"
                         placeholder="请选择用车日期"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="航班时间" prop="flightTime">
          <a-time-picker v-model="form.flightTime"
                         placeholder="请选择航班时间"
                         format="HH:mm"
                         valueFormat="HH:mm"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="用车时间" prop="useCarTime">
          <a-time-picker v-model="form.useCarTime"
                         format="HH:mm"
                         valueFormat="HH:mm"
                         placeholder="请选择用车时间"
                         style="width: 100%;"/>
        </a-form-model-item>

        <a-form-model-item label="产品类型" prop="productType">
          <a-input v-model="form.productType" placeholder="请输入产品类型"/>
        </a-form-model-item>

        <a-form-model-item label="车型" prop="carType">
          <a-input v-model="form.carType" placeholder="请输入车型"/>
        </a-form-model-item>

        <a-form-model-item label="航班车次号" prop="flightNumber">
          <a-input v-model="form.flightNumber" placeholder="请输入航班车次号"/>
        </a-form-model-item>

        <a-form-model-item label="上车地点" prop="start">
          <choice-address-block v-model="form.start"
                                map-id="startAddressMap"
                                placeholder="请选择上车地点（可在地图上选取）"></choice-address-block>
        </a-form-model-item>

        <a-form-model-item label="下车地点" prop="destination">
          <choice-address-block v-model="form.destination"
                                map-id="destinationAddressMap"
                                placeholder="请选择下车地点（可在地图上选取）"></choice-address-block>
        </a-form-model-item>

        <a-form-model-item label="预定部门" prop="reservationDepartment">
          <a-input v-model="form.reservationDepartment" placeholder="请输入预定部门"/>
        </a-form-model-item>

        <a-form-model-item label="客户名称" prop="customerName">
          <a-input v-model="form.customerName" placeholder="请输入客户名称"/>
        </a-form-model-item>

        <a-form-model-item label="采购应付金额（元）" prop="amountPayable">
          <a-input-number v-model="form.amountPayable" :min="0" style="width: 100%;" placeholder="请输入采购应付金额（元）"/>
        </a-form-model-item>

        <a-form-model-item label="结算价格（元）" prop="settlementPrice">
          <a-input-number v-model="form.settlementPrice" :min="0" style="width: 100%;" placeholder="请输入结算价格（元）"/>
        </a-form-model-item>

        <a-form-model-item label="预订人" prop="reservationPeople">
          <a-input v-model="form.reservationPeople" placeholder="请输入预订人"/>
        </a-form-model-item>

        <a-form-model-item label="车队" prop="motorcade">
          <a-input v-model="form.motorcade" placeholder="请输入车队"/>
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-textarea :maxLength="100" allowClear v-model="form.remark" placeholder="请输入备注（100字内）" :rows="4"/>
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
import moment from 'moment';
import VueMixins from '@/pages/mixins/vueMixins';
import ModalMixins from '@/pages/mixins/modalMixins';
import { orderService } from '@/services';
import CUpload from '@/components/file/cUpload.vue';
import FileUpload from '@/components/file/ImageUpload.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';
import ChoiceAddressBlock from '@/pages/order/choiceAddressBlock.vue';

@Component({
  name: 'OrderFormModal',
  components: {
    ChoiceAddressBlock,
    ImageUpload,
    FileUpload,
    CUpload,
  },
})
export default class OrderFormModal extends Mixins(VueMixins, ModalMixins) {
  title = '订单信息添加';

  labelCol = { span: 6 };

  wrapperCol = { span: 18 };

  isEdit = false;

  form: any = {
    orderNumber: undefined,
    channel: undefined,
    passengerName: undefined,
    passengerPhone: undefined,
    useCarDate: undefined,
    flightTime: undefined,
    useCarTime: undefined,
    productType: undefined,
    flightNumber: undefined,
    carType: undefined,
    start: undefined,
    destination: undefined,
    reservationDepartment: undefined,
    customerName: undefined,
    amountPayable: undefined,
    settlementPrice: undefined,
    reservationPeople: undefined,
    motorcade: undefined,
    remark: undefined,
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
    this.$nextTick(() => {
      if (info) {
        this.isEdit = true;
        this.title = '订单信息编辑';
        this.form = formatData();
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

        const submitFormData = {};
        Object.keys(this.form)
            .forEach((key) => {
              if (!['start', 'destination'].includes(key)) {
                submitFormData[key] = this.form[key];
              }
            });

        if (this.isEdit) {
          orderService.updateOrder(submitFormData)
              .then((res) => {
                this.$message.success('订单信息更新成功！');
                this.emitSubmitSuccess(res);
                this.close();
              }, (error) => {
                this.$message.error('订单信息更新失败！');
                this.emitSubmitFail();
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
    }, (error) => {
      console.error(error);
      return false;
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
