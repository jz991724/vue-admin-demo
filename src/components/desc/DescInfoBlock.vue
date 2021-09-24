/**
* @描述: des描述信息的card
* @作者: 张俊
* @创建时间: 2021-06-21 08:44:53
*/
<template>
  <a-descriptions class="xf-margin-top" v-bind="{...defaultConfig,...$attrs}">
    <template slot="title">
      <slot name="title"></slot>
    </template>
    <template v-for="{key,label,value,span,customRender} in descInfo">
      <a-descriptions-item :key="key" :span="span||1">
        <template slot="label">
          <slot :name="`${key}_label`">
            <span class="text-black-85 xf-text-inline">{{ label }}</span>
          </slot>
        </template>

        <slot :name="key" v-bind="{key,label,value,span,dataSource}">
            <span v-if="customRender" class="text-black-65 text-cut"
                  v-html="customRender(value||dataSource[key])"></span>
          <span v-else class="text-black-65" v-html="value||(dataSource[key]||'')"></span>
        </slot>
      </a-descriptions-item>
    </template>
  </a-descriptions>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({ name: 'DescInfoBlock' })
export default class DescInfoBlock extends Vue {
  @Prop({
    type: Array,
    default: () => ([]),
  }) descInfo: any[] | undefined;

  @Prop({
    type: Object,
    default: () => ({}),
  }) dataSource: any;

  defaultConfig = {
    column: 2,
    colon: !Object.keys(this.$attrs).includes('bordered'),
    size: 'small',
  };
}
</script>

<style scoped lang="less">
///deep/ .ant-descriptions-item {
//  > span {
//    max-width: 60%;
//    overflow: hidden;
//    text-overflow: ellipsis;
//  }
//}
</style>
