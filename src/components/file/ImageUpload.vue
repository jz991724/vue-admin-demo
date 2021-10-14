/**
* @描述: 文件上传
* @作者: 张俊
* @创建时间: 2021-05-17 17:22:28
*/
<template>
  <div class="clearfix" style="line-height: initial;">
    <a-upload list-type="picture-card"
              :file-list="fileList"
              v-bind="$attrs"
              :disabled="readonly"
              :customRequest="customRequest"
              @preview="handlePreview"
              @change="handleChange">
      <div v-if="fileList.length < maxCount">
        <template v-if="readonly">
          <!--          <a-icon type="file-image"/>-->
          <div class="ant-upload-text">
            暂无图片
          </div>
        </template>

        <template v-else>
          <a-icon type="plus"/>
          <div class="ant-upload-text">
            <slot></slot>
          </div>
        </template>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { commonService } from '@/services';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

@Component({ name: 'ImageUpload' })
export default class ImageUpload extends Vue {
  @Prop({
    type: Array,
    default: () => ([]),
  }) value: any[] | undefined;

  // 上传的最大数量
  @Prop({
    type: Number,
    default: 1,
  }) maxCount: number | undefined;

  // 只读状态
  @Prop({
    type: Boolean,
    default: false,
  }) readonly: boolean | undefined;

  previewVisible = false;

  previewImage = '';

  fileList: any[] = [];

  customRequest(options) {
    const { file } = options;
    const formData = new FormData();
    formData.append('file', file);
    return new Promise((resolve, reject) => {
      commonService.uploadFile(formData)
          .then(({ data }) => {
            options.onSuccess(data, file);
          });
    });
  }

  handleCancel() {
    this.previewVisible = false;
  }

  async handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  handleChange({
                 file,
                 fileList,
                 event,
               }) {
    this.fileList = fileList;

    if (fileList?.length > 0) {
      // 最后一项就是正操作的文件
      const [lastFile] = [...fileList].reverse();
      if (lastFile?.status === 'done') {
        this.emitUploadChange(fileList);
      }
    } else {
      this.emitUploadChange(fileList);
    }
  }

  // 上传到后台的文件change
  @Emit('change')
  emitUploadChange(files = []) {
    return files;
  }

  @Watch('value', {
    immediate: true,
    deep: true,
  })
  handleFilesChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.fileList = newVal.filter(({ uid }) => !!uid) || [];
    }
  }
}
</script>

<style scoped lang="less">

</style>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
