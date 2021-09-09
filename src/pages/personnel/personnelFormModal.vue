/**
* @描述: 驾驶员添加modal
* @作者: 张俊
* @创建时间: 2021-08-26 10:45:08
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
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="form.name" placeholder="请输入姓名"/>
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
        <a-form-model-item label="电话号码" prop="phoneNumber">
          <a-input v-model="form.phoneNumber" placeholder="请输入电话号码"/>
        </a-form-model-item>
        <a-form-model-item label="入职时间" prop="entryTime">
          <a-date-picker v-model="form.entryTime"
                         format="YYYY-MM-DD HH:mm:ss"
                         showTime
                         placeholder="请选择入职时间"
                         style="width :100%"/>
        </a-form-model-item>
        <a-form-model-item label="车牌号" prop="licenseNumber">
          <a-input v-model="form.licenseNumber" placeholder="请输入车牌号"/>
        </a-form-model-item>
        <a-form-model-item label="车型" prop="carType">
          <a-input v-model="form.carType" placeholder="请输入车型"/>
        </a-form-model-item>
        <a-form-model-item label="车型分类" prop="vehicleClass">
          <a-input v-model="form.vehicleClass" placeholder="请输入车型分类"/>
        </a-form-model-item>
        <a-form-model-item label="组别" prop="group">
          <a-input v-model="form.group" placeholder="请输入组别"/>
        </a-form-model-item>
        <!--        <a-form-model-item label="人员类型" prop="type">-->
        <!--          <a-input v-model="form.type"/>-->
        <!--        </a-form-model-item>-->
        <a-form-model-item label="车俩登记时间" prop="carRegisterTime">
          <a-date-picker v-model="form.carRegisterTime"
                         format="YYYY-MM-DD HH:mm:ss"
                         showTime
                         placeholder="请选择车俩登记时间"
                         style="width :100%"/>
        </a-form-model-item>
        <a-form-model-item label="住址" prop="address">
          <a-input v-model="form.address" :max="100" placeholder="请输入住址"/>
        </a-form-model-item>
        <a-form-model-item label="身份证正面" prop="identityCardFrontPath">
          <image-upload :value="form.identityCardFrontPath"
                        @change="(value)=>{formatFile(value,'identityCardFrontPath')}"></image-upload>
        </a-form-model-item>
        <a-form-model-item label="身份证反面" prop="identityCardBackPath">
          <image-upload :value="form.identityCardBackPath"
                        @change="(value)=>{formatFile(value,'identityCardBackPath')}"></image-upload>
        </a-form-model-item>
        <a-form-model-item label="驾驶证正页" prop="drivingLicenceFrontPath">
          <image-upload :value="form.drivingLicenceFrontPath"
                        @change="(value)=>{formatFile(value,'drivingLicenceFrontPath')}"></image-upload>
        </a-form-model-item>
        <a-form-model-item label="驾驶证副页" prop="drivingLicenceBackPath">
          <image-upload :value="form.drivingLicenceBackPath"
                        @change="(value)=>{formatFile(value,'drivingLicenceBackPath')}"></image-upload>
        </a-form-model-item>
        <a-form-model-item label="行车证正页" prop="vehicleLicenceFrontPath">
          <image-upload :value="form.vehicleLicenceFrontPath"
                        @change="(value)=>{formatFile(value,'vehicleLicenceFrontPath')}"></image-upload>
        </a-form-model-item>
        <a-form-model-item label="行车证副页" prop="vehicleLicenceBackPath">
          <image-upload :value="form.vehicleLicenceBackPath"
                        @change="(value)=>{formatFile(value,'vehicleLicenceBackPath')}"></image-upload>
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
import { SexEnum } from '@/services/personnel';
import ModalMixins from '@/pages/mixins/modalMixins';
import { personnelService } from '@/services';
import CUpload from '@/components/file/cUpload.vue';
import FileUpload from '@/components/file/ImageUpload.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';

@Component({
  name: 'AddPersonnelForm',
  components: {
    ImageUpload,
    FileUpload,
    CUpload,
  },
})
export default class AddPersonnelForm extends Mixins(VueMixins, ModalMixins) {
  title = '驾驶员添加';

  SexEnum = SexEnum;

  labelCol = { span: 4 };

  wrapperCol = { span: 20 };

  isEdit = false;

  form: any = {
    name: '',
    sex: 0,
    phoneNumber: '',
    licenseNumber: '',
    carType: '',
    vehicleClass: '',
    group: '',
    entryTime: '',
    carRegisterTime: '',
    address: '',
    identityCardFrontPath: [],
    identityCardBackPath: [],
    drivingLicenceFrontPath: [],
    drivingLicenceBackPath: [],
    vehicleLicenceFrontPath: [],
    vehicleLicenceBackPath: [],
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
    }, {
      pattern: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
      message: '请输入正确的车牌号',
      trigger: 'change',
    }],
    phoneNumber: [{
      required: true,
      message: '请输入电话号码',
      trigger: 'blur',
    }, {
      pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
      message: '请输入正确的电话号码',
      trigger: 'change',
    }],
    entryTime: [{
      required: true,
      message: '请选择入职时间',
      trigger: 'change',
    }],
    carRegisterTime: [{
      required: true,
      message: '请选择车俩登记时间',
      trigger: 'change',
    }],
    identityCardFrontPath: [{
      required: true,
      message: '请上传身份证正面照片',
    }],
    identityCardBackPath: [{
      required: true,
      message: '请上传身份证反面照片',
    }],
    drivingLicenceFrontPath: [{
      required: true,
      message: '请上传驾驶证正页照片',
    }],
    drivingLicenceBackPath: [{
      required: true,
      message: '请上传驾驶证副页照片',
    }],
    vehicleLicenceFrontPath: [{
      required: true,
      message: '请上传行车证正页照片',
    }],
    vehicleLicenceBackPath: [{
      required: true,
      message: '请上传行车证副页照片',
    }],
  };

  // 打开modal
  openModal(info = undefined) {
    this.open();
    this.$nextTick(() => {
      if (info) {
        this.isEdit = true;
        this.title = '驾驶员编辑';
        debugger;
        this.form = { ...info };
      } else {
        this.isEdit = false;
        this.title = '驾驶员添加';
      }
    });
  }

  formatFile(file = [], name) {
    const [temp] = file;
    if (temp) {
      const { response: { wjlj } } = temp;

      this.form[name] = wjlj;
    } else {
      this.form[name] = undefined;
    }
  }

  formatData(temp_data) {
    const {
      identityCardFrontPath,
      identityCardBackPath,
      drivingLicenceFrontPath,
      drivingLicenceBackPath,
      vehicleLicenceFrontPath,
      vehicleLicenceBackPath,
    } = temp_data;

    const dic = {
      identityCardFrontPath,
      identityCardBackPath,
      drivingLicenceFrontPath,
      drivingLicenceBackPath,
      vehicleLicenceFrontPath,
      vehicleLicenceBackPath,
    };

    Object.keys(dic)
        .forEach((key) => {
          const temp_value = dic[key];
          if (Array.isArray(temp_value)) {
            if (temp_value?.length > 0) {
              const [{ response: { wjlj } }] = dic[key] || [];
              temp_data[key] = wjlj;
            } else {
              temp_data[key] = '';
            }
          }
        });

    return temp_data;
  }

  // 提交
  onSubmit(e) {
    e.preventDefault();
    const { ruleForm }: any = this.$refs;
    ruleForm.validate((valid) => {
      if (valid) {
        const submitFormData = this.form;
        console.log('submitFormData：', submitFormData);
        if (this.isEdit) {
          personnelService.updatePersonnel(submitFormData)
              .then((res) => {
                this.$message.success('驾驶员信息更新成功！');
                this.emitSubmitSuccess(res);
                this.close();
              });
        } else {
          personnelService.addPersonnel(submitFormData)
              .then((res) => {
                this.$message.success('驾驶员信息提交成功！');
                this.emitSubmitSuccess(res);
                this.close();
              }, (error) => {
                this.$message.error('驾驶员信息提交失败！');
                this.emitSubmitFail();
              });
        }
      }
    }, (error) => {
      console.error(error);
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
