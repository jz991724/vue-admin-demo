//地图
<template>
  <div :id="domId"></div>
</template>

<script lang="ts">
import {
  Vue, Component, Model, Watch, Emit, Prop,
} from 'vue-property-decorator';

@Component({ name: 'MainMap' })
export default class MainMap extends Vue {
  @Model('change', {
    type: Object,
    default: () => ({}),
  }) locationPosition: any | undefined;

  @Prop({
    type: String,
    default: 'container',
  }) domId: string | undefined;

  mainMap: any;

  markerLayer: any;

  window_temp: any = window;

  initMap() {
    const center = new this.window_temp.TMap.LatLng(25.044492, 102.721666);
    // 初始化地图
    const map = new this.window_temp.TMap.Map(this.domId, {
      rotation: 20, // 设置地图旋转角度
      pitch: 30, // 设置俯仰角度（0~45）
      zoom: 12, // 设置地图缩放级别
      center, // 设置地图中心点坐标
    });

    // 如果不给地图添加坐标点,这里可以忽略了,如果要添加请继续看(重点关注***markerLayer***)
    this.mainMap = map;
    this.mainMap.on('click', (e) => {
      this.markerLayer.setGeometries([]);
      const position = e.latLng;
      this.emitPositionChange(position);
      this.addImgMarker(position);
    });
  }

  addImgMarker(position) {
    if (this.markerLayer) {
      this.markerLayer.setGeometries([]);
    }
    this.markerLayer = new this.window_temp.TMap.MultiMarker({
      map: this.mainMap,
      // 样式定义
      styles: {
        // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
        myStyle: new this.window_temp.TMap.MarkerStyle({
          width: 32, // 点标记样式宽度（像素）
          height: 32, // 点标记样式高度（像素）
          src: '/map/choiceAddress_icon.png', // 图片路径
          // 焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          anchor: {
            x: 16,
            y: 32,
          },
        }),
      },
      // 点标记数据数组
      geometries: [
        {
          id: '1', // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          styleId: 'myStyle', // 指定样式id
          position, // 点标记坐标位置
        },
      ],
    });

    this.mainMap.panTo(position);
  }

  mounted() {
    this.markerLayer = new this.window_temp.TMap.MultiMarker({});
    this.initMap();
  }

  @Watch('locationPosition', {
    deep: true,
    immediate: true,
  })
  handleLocationChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.$nextTick(() => {
        const {
          location,
        } = newVal;
        if (location) {
          const positionParams = {
            height: 0,
            ...location,
          };
          this.addImgMarker(positionParams);
        }
      });
    }
  }

  @Emit('change')
  emitPositionChange(position) {
    return position;
  }
}
</script>

<style scoped lang="less">
#container {
  width: 100%;
  height: 100%;
}
</style>
