/**
* @描述: 用户添加modal
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
        <a-form-model-item label="姓名" prop="userName">
          <a-input v-model="form.userName" placeholder="请输入姓名"/>
        </a-form-model-item>
        <a-form-model-item label="真实姓名" prop="realName">
          <a-input v-model="form.realName" placeholder="请输入真实姓名"/>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-radio-group v-model="form.status">
            <a-radio-button :value="UserInfoStatusEnum.在职">
              在职
            </a-radio-button>

            <a-radio-button :value="UserInfoStatusEnum.离职">
              离职
            </a-radio-button>

            <a-radio-button :value="UserInfoStatusEnum.请假">
              请假
            </a-radio-button>

            <a-radio-button :value="UserInfoStatusEnum.休息">
              休息
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="人员类型" prop="userType">
          <a-select v-model="form.userType">
            <a-select-option :value="UserInfoTypeEnum.管理员">管理员</a-select-option>
            <a-select-option :value="UserInfoTypeEnum.调度员">调度员</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="password">
          <a-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入新密码"/>
        </a-form-model-item>
        <a-form-model-item label="密码确认" prop="checkPassword">
          <a-input v-model="form.checkPassword" type="password" autocomplete="off" placeholder="请输入密码确认"/>
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
  Component, Mixins, Emit, Watch, Prop,
} from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import ModalMixins from '@/pages/mixins/modalMixins';
import userInfoService, { UserInfoStatusEnum, UserInfoTypeEnum } from '@/services/userManagement';
import CUpload from '@/components/file/cUpload.vue';
import FileUpload from '@/components/file/ImageUpload.vue';
import ImageUpload from '@/components/file/ImageUpload.vue';

@Component({
  name: 'AddUserInfoForm',
  components: {
    ImageUpload,
    FileUpload,
    CUpload,
  },
})
export default class AddUserInfoForm extends Mixins(VueMixins, ModalMixins) {
  @Prop({
    type: String,
    default: '用户添加',
  }) modalTitle: string | undefined;

  UserInfoTypeEnum = UserInfoTypeEnum;

  UserInfoStatusEnum = UserInfoStatusEnum;

  title = '用户添加';

  labelCol = { span: 4 };

  wrapperCol = { span: 14 };

  isEdit = false;

  form: any = {
    userName: undefined,
    realName: undefined,
    password: undefined,
    checkPassword: undefined,
    status: UserInfoStatusEnum.在职,
    userType: UserInfoTypeEnum.调度员,
  };

  rules = {
    userName: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur',
      },
    ],
    realName: [
      {
        required: true,
        message: '请输入真实姓名',
        trigger: 'blur',
      },
    ],
    password: [{
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    }, {
      len: 6,
      message: '请输入6位数的密码',
      trigger: 'change',
    }],
    checkPassword: [{
      required: true,
      message: '请输入确认密码',
      trigger: 'blur',
    }, {
      validator: this.matchPasswordValidator,
      trigger: 'change',
    }],
  };

  // 密码是否一致的验证
  matchPasswordValidator(rule, value, callback) {
    if (value === '') {
      callback(new Error('请再次输入密码！'));
    } else if (value !== this.form.password) {
      callback(new Error('两次输入不一致！'));
    } else {
      callback();
    }
  }

  // 打开modal
  openModal(info = undefined) {
    this.open();
    this.$nextTick(() => {
      if (info) {
        this.isEdit = true;
        this.title = this.modalTitle || '用户信息编辑';
        this.form = {
          ...info,
          password: undefined,
        };
      } else {
        this.isEdit = false;
        this.title = this.modalTitle || '用户信息添加';
      }
    });
  }

  // 提交
  onSubmit() {
    const { ruleForm }: any = this.$refs;
    const submitFormData = this.form;
    ruleForm.validate((valid) => {
      if (valid) {
        if (this.isEdit) {
          userInfoService.updateUserInfo(submitFormData)
              .then((res) => {
                this.$message.success('用户信息信息更新成功！');
                this.emitSubmitSuccess(res);
                this.close();
              });
        } else {
          userInfoService.addUserInfo(submitFormData)
              .then((res) => {
                this.$message.success('用户信息信息提交成功！');
                this.emitSubmitSuccess(res);
                this.close();
              }, (error) => {
                this.$message.error('用户信息信息提交失败！');
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
