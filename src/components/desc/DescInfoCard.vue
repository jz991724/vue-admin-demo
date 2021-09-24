/**
* @描述: des描述信息的card
* @作者: 张俊
* @创建时间: 2021-06-21 08:44:53
*/
<template>
  <a-card :hoverable="true"
          :body-style="{padding: '16px'}"
          style="border-radius: 4px;"
          @mouseover="isHoverCard=true"
          @mouseout="isHoverCard=false"
          @click="handleClick">
    <div slot="cover" class="bg-black-15" style="height: 144px;">
      <img v-if="getDescInfo.cover"
           class="response"
           :class="{active:isHoverCard}"
           :src="getDescInfo.cover"/>

      <a-empty v-else description="暂无图片" style="padding: 22px;" :class="{active:isHoverCard}">
        <img slot="image" src="../assets/emptyImg_icon.png" height="64" width="64"/>
      </a-empty>
    </div>

    <slot v-bind="dataSource"></slot>

    <a-card-meta style="position: relative;z-index: 10;">
      <template slot="description">
        <template v-for="{title,key,value,span,customRender} in getDescInfo.info">
          <div class="flex" :key="key">
            <slot :name="`${key}_label`" v-bind="{value,title,info:getDescInfo.info,dataSource,text:value}">
              <div slot="label"
                   class="xf-text-12 xf-text-regular text-black-45 xf-padding-bottom-xs xf-text-inline">
                {{ title }}：
              </div>
            </slot>

            <slot :name="key" v-bind="{key,title,value,span,dataSource}">
              <div v-if="customRender"
                   class="xf-text-12 xf-text-regular text-black text-cut"
                   v-html="customRender(value||dataSource[key])"></div>
              <div v-else
                   class="xf-text-12 xf-text-regular text-black text-cut"
                   v-html="value||(dataSource[key]||'')"></div>
            </slot>
          </div>
        </template>
      </template>
    </a-card-meta>

    <slot name="footer" v-bind="dataSource"></slot>
  </a-card>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';

@Component({ name: 'DescInfoCard' })
export default class DescInfoCard extends Vue {
  @Prop({
    type: Object,
    default: () => ({}),
  }) dataSource: object | undefined;

  @Prop({
    type: Array,
    default: () => ([]),
  }) descColumns: any[] | undefined;

  @Prop({ type: String }) coverImageSrc: string | undefined;

  @Prop({ type: String }) coverImageKey: string | undefined;

  isHoverCard = false;

  get getDescInfo() {
    const { coverImageKey, descColumns } = this;
    if (coverImageKey) {
      const coverImg = this.dataSource[coverImageKey];
      if (coverImg) {
        return {
          cover: coverImg,
          info: descColumns,
        };
      }
    }

    return {
      cover: this.coverImageSrc || '',
      info: descColumns,
    };
  }

  @Emit('click')
  handleClick() {
    return { ...this.dataSource };
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-card-cover {
  .active {
    transform: scale(1.15);
    transition: all 500ms ease;
  }
}
</style>
