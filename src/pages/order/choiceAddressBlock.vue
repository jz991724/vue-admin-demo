/**
* @描述:地图选择block
* @作者: 张俊
* @创建时间: 2021-08-30 11:35:50
*/
<template>
  <div>
    <pre>{{ dataSource }}</pre>
    <a-auto-complete :dataSource="dataSource |dataSourceFilter"
                     style="width: 200px"
                     placeholder="请选择地址"
                     @search="getAddressInfoListByKeyword"
                     @select="onSelect"
                     :filter-option="filterOption">
      <!--      <template slot="dataSource">-->
      <!--        <a-select-option v-for="info in dataSource" :key="info.id">-->
      <!--          {{ info.address }}-->
      <!--        </a-select-option>-->
      <!--      </template>-->
    </a-auto-complete>

    <main-map :location-position="addressInfo" @change="onPositionChange"></main-map>
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
  filters: {
    dataSourceFilter: (dataSource = []) => {
      debugger;
      return dataSource.map(({ address }) => address);
    },
  },
})
export default class ChoiceAddressBlock extends Mixins(VueMixins) {
  @Model('change', {
    type: Array,
    default: () => ([]),
  }) position: any | undefined;

  @Prop({
    type: String,
    default: '',
  }) keyword: string | undefined;

  addressInfo = {};

  dataSource = [];

  filterOption(input, option) {
    return (
        option.componentOptions.children[0].text.toUpperCase()
            .indexOf(input.toUpperCase()) >= 0
    );
  }

  // 通过position获取地址信息
  getAddressInfoByPosition(position = []) {
    const params = {
      location: position.join(','),
      key: 'KC7BZ-ZPH3D-FDW4E-P3YJB-OYAQQ-M6BBY',
      get_poi: '0',
    };
    params.output = 'jsonp';
    this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/', params)
        .then((res) => {
          debugger;
          const {
            status,
            result: {
              location,
              address,
            },
          } = res;
          if (status === 0) {
            this.addressInfo = res;
            this.emitChange(res);
          }
        });
  }

  // 通过关键字获取地址信息列表
  getAddressInfoListByKeyword(keyword) {
    const params = {
      // region_fix: '0',
      region: '昆明',
      key: 'KC7BZ-ZPH3D-FDW4E-P3YJB-OYAQQ-M6BBY',
      keyword,
    };
    params.output = 'jsonp';
    this.$jsonp('https://apis.map.qq.com/ws/place/v1/suggestion/', params)
        .then((res) => {
          debugger;
          const {
            status,
            data,
          } = res;
          if (status === 0) {
            debugger;
            this.dataSource = data || [];
            // this.addressInfo = { address: keyword };
          }
        });
  }

  // 点击地图获取地址信息
  onPositionChange(position) {
    debugger;
    const {
      lat,
      lng,
    } = position;
    this.getAddressInfoByPosition([lat, lng]);
  }

  onSelect(value, option) {
    const selectedOption = this.dataSource.find(({ id }) => id === value);
    this.addressInfo = selectedOption;
    this.emitChange(selectedOption);
  }

  @Emit('change')
  emitChange(info) {
    return info;
  }

  @Watch('position')
  handlePositionChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.getAddressInfoByPosition(newVal);
    }
  }

  // @Watch('keyword')
  // handleKeywordChange(newVal, oldVal) {
  //   if (newVal !== oldVal) {
  //     this.getAddressInfoListByKeyword(newVal);
  //   }
  // }
}
</script>

<style scoped>

</style>
