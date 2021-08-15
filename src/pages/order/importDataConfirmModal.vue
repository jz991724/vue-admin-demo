/**
* @描述: 导入数据确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" :destroyOnClose="true" title="导入数据确认" @ok="handleOk()">
    <a-radio-group v-model="importType">
      <a-radio value="cover">
        覆盖原有数据
      </a-radio>
      <a-radio value="push">
        向原有数据的尾部添加数据
      </a-radio>
      <a-radio value="unshift">
        向原有数据的头部添加数据
      </a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component({
  name: 'ImportDataConfirmModal',
})
export default class ImportDataConfirmModal extends Vue {
  visible = false;

  importType = 'cover';

  openModal(params = undefined) {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  // 确定
  @Emit('confirm')
  handleOk() {
    this.closeModal();
    return this.importType;
  }
}
</script>

<style scoped lang="less">

</style>
