/**
* @描述: 驾驶员添加modal
* @作者: 张俊
* @创建时间: 2021-08-26 10:45:08
*/
<template>
  <a-modal :title="title"
           :visible="visible"
           v-bind="defaultOptions"
           @ok="handleOk"
           @cancel="handleCancel">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="姓名" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="电话号码" prop="phoneNumber">
          <a-input v-model="form.phoneNumber"/>
        </a-form-model-item>
        <a-form-model-item label="入司时间" prop="joinDate">
          <a-date-picker v-model="form.joinDate"
                         show-time
                         type="date"
                         placeholder="请选择入司时间"
                         style="width: 100%;"/>
        </a-form-model-item>
        <a-form-model-item label="性别" prop="sex">
          <a-radio-group v-model="form.sex">
            <a-radio :value="SexEnum.男">
              男
            </a-radio>
            <a-radio :value="SexEnum.女">
              女
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="车牌号" prop="licenseNumber">
          <a-input v-model="form.licenseNumber"/>
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
import { Component, Mixins, Emit } from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import { SexEnum } from '@/services/personnel';
import ModalMixins from '@/pages/mixins/modalMixins';
import { personnelService } from '@/services';

@Component({ name: 'AddPersonnelForm' })
export default class AddPersonnelForm extends Mixins(VueMixins, ModalMixins) {
  title = '驾驶员添加';

  SexEnum = SexEnum;

  labelCol = { span: 4 };

  wrapperCol = { span: 14 };

  form = {
    name: undefined,
    licenseNumber: undefined,
    sex: 0,
    joinDate: undefined,
    phoneNumber: undefined,
    type: 0,
    status: 0,
  };

  rules = {
    name: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur',
      },
    ],
    licenseNumber: [{
      required: true,
      message: '请输入车牌号',
      trigger: 'blur',
    }],
    joinDate: [{
      required: true,
      message: '请选择加入公司的日期',
      trigger: 'change',
    }],
  };

  // 打开modal
  // openModal(params) {
  //   const { ydbm } = params;
  //   if (ydbm) {
  //     this.open();
  //
  //     this.$nextTick(() => {
  //       this.fetchData(ydbm);
  //     });
  //   }
  // }

  // 提交
  onSubmit() {
    const { ruleForm }: any = this.$refs;
    ruleForm.validate((valid) => {
      if (valid) {
        personnelService.addPersonnel(this.form)
            .then((res) => {
              this.$message.success('驾驶员信息提交成功！');
              this.emitSubmitSuccess(res);
              this.close();
            });
      } else {
        this.$message.error('驾驶员信息提交失败！');
        this.emitSubmitFail();
        this.close();
      }
    });
  }

  // 重置
  resetForm() {
    const { ruleForm }: any = this.$refs;
    ruleForm.resetFields();
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
