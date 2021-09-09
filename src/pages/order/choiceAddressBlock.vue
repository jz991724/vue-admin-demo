/**
* @描述:地图选择block
* @作者: 张俊
* @创建时间: 2021-08-30 11:35:50
*/
<template>
  <div>
    <a-auto-complete placeholder="请选择地址"
                     @search="getAddressInfoListByKeyword"
                     @select="onSelect"
                     :backfill="false"
                     v-model="addressName"
                     :filter-option="filterOption">
      <template slot="dataSource">
        <a-select-option v-for="info in dataSource" :key="info.id">
          {{ info.address }}
        </a-select-option>
      </template>
    </a-auto-complete>

    <main-map :dom-id="mapId" :location-position="addressInfo" @change="onPositionChange"></main-map>
  </div>

</template>

<script lang="ts">
import {
  Component, Mixins, Emit, Model, Watch, Prop,
} from 'vue-property-decorator';
import VueMixins from '@/pages/mixins/vueMixins';
import MainMap from '@/pages/map/index.vue';

@Component({
  name: 'ChoiceAddressBlock',
  components: {
    MainMap,
  },
})
export default class ChoiceAddressBlock extends Mixins(VueMixins) {
  @Model('change', {
    type: Object,
    default: () => ({}),
  }) value: any | undefined;

  @Prop({
    type: String,
    default: '',
  }) keyword: string | undefined;

  @Prop({
    type: String,
    default: 'container',
  }) mapId: string | undefined;

  addressInfo = {};

  dataSource = [];

  addressName = '';

  filterOption(input, option) {
    return (
        option.componentOptions.children[0].text.toUpperCase()
            .indexOf(input.toUpperCase()) >= 0
    );
  }

  // 通过position获取地址信息
  getAddressInfoByPosition(position = [], callback = undefined) {
    if (position) {
      const params = {
        location: position.join(','),
        key: process.env.VUE_APP_TMAP_KEY,
        get_poi: '0',
        output: 'jsonp',
      };

      this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/', params)
          .then((res) => {
            debugger;
            const {
              status,
              result,
            } = res;
            if (status === 0) {
              this.addressInfo = result;
              if (callback) {
                callback(result);
              }
            }
          });
    }
  }

  // 通过关键字获取地址信息列表
  getAddressInfoListByKeyword(keyword) {
    const params = {
      // region_fix: '0',
      region: '昆明',
      key: process.env.VUE_APP_TMAP_KEY,
      keyword,
      output: 'jsonp',
    };

    this.$jsonp('https://apis.map.qq.com/ws/place/v1/suggestion/', params)
        .then((res) => {
          const {
            status,
            data,
          } = res;
          if (status === 0) {
            this.dataSource = data || [];
          }
        });
  }

  // 点击地图获取地址信息
  onPositionChange(position) {
    const {
      lat,
      lng,
    } = position;
    if (lat && lng) {
      this.getAddressInfoByPosition([lat, lng], (result) => {
        this.addressName = result.address;
        this.emitChange(result);
      });
    }
  }

  onSelect(value, option) {
    const selectedOption = this.dataSource.find(({ id }) => id === value);
    this.addressInfo = selectedOption;
    this.emitChange(selectedOption);
  }

  mounted() {
    this.addressName = this.keyword;
  }

  @Emit('change')
  emitChange(info = this.addressInfo) {
    return info;
  }

  @Watch('value', {
    deep: true,
    immediate: true,
  })
  handleValueChange(newVal, oldVal) {
    if (newVal !== oldVal && newVal?.location) {
      this.addressInfo = newVal;
      const {
        address,
        location: {
          lat,
          lng,
        },
      } = newVal;
      if (lat && lng) {
        this.$nextTick(() => {
          this.addressName = address;
          this.getAddressInfoByPosition([lat, lng]);
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
