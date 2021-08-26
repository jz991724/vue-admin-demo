<template>
  <div :class="clsName">
    <a-upload v-bind="$attrs" v-on="$listeners" ref="el" :customRequest="customRequest">
      <a-button>
        <a-icon type="upload" v-if="showIcon"/>
        {{ text }}
      </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
// import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {
  Component, Vue, Inject, Prop, Watch,
} from 'vue-property-decorator';
import axios from 'axios';
import VueMixins from '@/pages/mixins/vueMixins';

@Component({
  components: {},
  name: 'CUpload',
})
export default class CUpload extends VueMixins {
  @Prop({ type: Array })
  cname: Array<string>;

  @Prop({
    type: Boolean,
    default: true,
  })
  showIcon: boolean;

  @Prop({
    type: String,
    default: '',
  })
  text: string;

  /**
   * 是否启用分片上传,默认不启用
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  chunked: boolean;

  upload({
           action,
           data,
           file,
           filename,
           headers,
           onError,
           onProgress,
           onSuccess,
           withCredentials,
         }) {
    const formData = new FormData();
    if (data) {
      Object.keys(data)
          .forEach((key) => {
            formData.append(key, data[key]);
          });
    }
    formData.append(filename, file);
    axios
        .post(action, formData, {
          withCredentials,
          headers,
          onUploadProgress: ({
                               total,
                               loaded,
                             }) => {
            onProgress(
                {
                  percent: Math.round((loaded / total) * 100)
                      .toFixed(2),
                },
                file,
            );
          },
        })
        .then(({ data: response }) => {
          onSuccess(response, file);
        })
        .catch(onError);
  }

  uploadChunked({
                  action,
                  data,
                  file,
                  filename,
                  headers,
                  onError,
                  onProgress,
                  onSuccess,
                  withCredentials,
                }) {
    const succeed = 0;
    const fileSize = file.size;
    const fileName = file.name;
    let uploadSize = 0;
    const promiseList = [];
    const shardSize = 2 * 1024 * 1024; // 以2MB为一个分片
    const shardCount = Math.ceil(fileSize / shardSize); // 总片数
    for (let i = 0; i < shardCount; i++) {
      const start = i * shardSize;
      const end = Math.min(fileSize, start + shardSize);

      const form = new FormData();
      if (data) {
        Object.keys(data)
            .forEach((key) => {
              form.append(key, data[key]);
            });
      }
      form.append('data', file.slice(start, end)); // slice方法用于切出文件的一部分
      form.append('name', file.name);
      form.append('total', shardCount.toString()); // 总片数
      form.append('index', (i + 1).toString()); // 当前是第几片
      const promise = axios.post(action, form, {
        withCredentials,
        headers,
        onUploadProgress: ({
                             total,
                             loaded,
                           }) => {
          uploadSize += loaded;
          onProgress(
              {
                percent: Math.round((uploadSize / fileName) * 100)
                    .toFixed(2),
              },
              file,
          );
        },
      });
      // 上传失败
      promiseList.push(promise);
    }

    Promise.all(promiseList)
        // eslint-disable-next-line no-shadow
        .then((data) => {
          onSuccess(data, file);
        })
        .catch(onError);
  }

  customRequest({
                  action,
                  data,
                  file,
                  filename,
                  headers,
                  onError,
                  onProgress,
                  onSuccess,
                  withCredentials,
                }) {
    if (this.chunked) {
      // 分片上传
      this.uploadChunked({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      });
    } else {
      // 上传
      this.upload({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      });
    }

    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  }

  get clsName() {
    const ret = [this.$style.container, this.cname];
    return ret;
  }

  init() {
    const { el } = this.$refs;
    const self = this;
  }

  mounted() {
    this.init();
  }

  destroyed() {
    debugger;
  }
}
</script>
<style module>
.container {
  /*position: fixed;*/
}
</style>
