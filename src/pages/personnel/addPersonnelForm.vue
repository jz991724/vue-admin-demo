//添加及编辑页面
<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="Activity name" prop="name">
        <a-input
            v-model="form.name"
            @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
        />
      </a-form-model-item>
      <a-form-model-item label="Activity zone" prop="region">
        <a-select v-model="form.region" placeholder="please select your zone">
          <a-select-option value="shanghai">
            Zone one
          </a-select-option>
          <a-select-option value="beijing">
            Zone two
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="Activity time" required prop="date1">
        <a-date-picker
            v-model="form.date1"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
        />
      </a-form-model-item>
      <a-form-model-item label="Instant delivery" prop="delivery">
        <a-switch v-model="form.delivery"/>
      </a-form-model-item>
      <a-form-model-item label="Activity type" prop="type">
        <a-checkbox-group v-model="form.type">
          <a-checkbox value="1" name="type">
            Online
          </a-checkbox>
          <a-checkbox value="2" name="type">
            Promotion
          </a-checkbox>
          <a-checkbox value="3" name="type">
            Offline
          </a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
      <a-form-model-item label="Resources" prop="resource">
        <a-radio-group v-model="form.resource">
          <a-radio value="1">
            Sponsor
          </a-radio>
          <a-radio value="2">
            Venue
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="Activity form" prop="desc">
        <a-input v-model="form.desc" type="textarea"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">
          Create
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetForm">
          Reset
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import { SexEnum } from '@/services/personnel';

@Component({ name: 'AddPersonnelForm' })
export default class AddPersonnelForm extends Mixins(VueMixins) {
  SexEnum = SexEnum;

  labelCol = { span: 4 };

  wrapperCol = { span: 14 };

  form = {
    name: '',
    region: undefined,
    date1: undefined,
    delivery: false,
    type: [],
    resource: '',
    desc: '',
  };

  rules = {
    name: [
      {
        required: true,
        message: 'Please input Activity name',
        trigger: 'blur',
      },
      {
        min: 3,
        max: 5,
        message: 'Length should be 3 to 5',
        trigger: 'blur',
      },
    ],
    region: [{
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    }],
    date1: [{
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    }],
    type: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    resource: [
      {
        required: true,
        message: 'Please select activity resource',
        trigger: 'change',
      },
    ],
    desc: [{
      required: true,
      message: 'Please input activity form',
      trigger: 'blur',
    }],
  };

  onSubmit() {
    this.$router.push('/personnel/personnelList');
    // eslint-disable-next-line consistent-return
    (this.$refs.ruleForm as any).validate((valid) => {
      if (valid) {
        alert('submit!');
        this.$router.push('/personnel/ppersonnelList');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  resetForm() {
    (this.$refs.ruleForm as any).resetFields();
  }
}
</script>

<style scoped>

</style>
