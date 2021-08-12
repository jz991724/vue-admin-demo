/**
* @描述: 文件上传
* @作者: 张俊
* @创建时间: 2021-05-17 17:22:28
*/
<template>
  <div class="clearfix">
    <a-upload v-bind="$attrs"
              :file-list="fileList"
              :remove="handleRemove"
              v-on="$listeners"
              :showUploadList="false"
              :before-upload="beforeUpload">
      <slot>
        <a-button>
          {{ title }}
        </a-button>
      </slot>
    </a-upload>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { requestHelper, METHOD } from '@/utils/request';

@Component({ name: 'FileUpload' })
export default class FileUpload extends Vue {
  @Model('change', {
    default: () => ([]),
  }) files: any | undefined;

  @Prop({
    type: String,
    default: '上传',
  }) title: string | undefined;

  // 是否可以多选
  @Prop({
    type: Boolean,
    default: false,
  }) isMultiple: boolean | undefined;

  fileList = [];

  uploading = false;

  mounted() {
    this.fileList = this.files || [];
  }

  // 删除操作
  handleRemove(file) {
    const index = this.fileList.indexOf(file);
    const newFileList = this.fileList.slice();
    newFileList.splice(index, 1);
    this.fileList = newFileList;
  }

  // 上传前（beforeUpload 返回 false 后，手动上传文件）
  beforeUpload(file) {
    this.fileList = [];
    this.fileList = [...this.fileList, file];
    return false;
  }

  // 上传操作
  handleUpload() {
    const { fileList: [file] } = this;
    const formData = new FormData();
    formData.append('file', file);
    requestHelper('/api/OrderInfo/Import', METHOD.POST, formData, this, undefined, 'uploading', {
      withCredentials: true,
    })
        .then((importFileData = []) => {
          if (importFileData.length < 1) {
            (this.$notification as any).warning({
              duration: 8,
              placement: 'bottomRight',
              message: '提示',
              description:
                  '您导入的文件数据可能为空，或者文件格式不满足导入要求！',
            });
          }
          this.emitUploadSuccess(importFileData);
        }, (error) => {
          console.error('上传文件报错:', error);
          (this.$notification as any).error({
            duration: 8,
            placement: 'bottomRight',
            message: '提示',
            description:
                '您导入的文件格式可能不满足导入要求，请确认后重试！',
          });
          this.emitUploadError(error);
        });
  }

  // 上传成功
  @Emit('success')
  emitUploadSuccess(params) {
    return params;
  }

  // 上传错误/失败
  @Emit('error')
  emitUploadError(params) {
    return params;
  }

  // loading
  @Emit('upLoading')
  emitUpLoading(e) {
    return e;
  }

  @Watch('fileList', {
    deep: true,
    immediate: true,
  })
  handleFileListChange(newVal, oldVal) {
    if (newVal !== oldVal && newVal?.length > 0) {
      this.handleUpload();
    }
  }

  @Watch('uploading', {
    immediate: true,
  })
  handleLoadingChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.emitUpLoading(newVal);
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-upload-select {
  width: 100%;
}
</style>
