/**
* @描述: 分析页面
* @作者: 张俊
* @创建时间: 2021-09-10 04:22:02
*/
<template>
  <a-card title="分析" :loading="spinning">
    <a-row :gutter="10" slot="extra">
      <a-col :span="12">
        <a-select :options="conditionsOptions.channel"
                  v-model="conditions.channel"
                  style="width: 200px;"
                  placeholder="请选择渠道"></a-select>
      </a-col>

      <a-col :span="12">
        <a-select :options="conditionsOptions.years"
                  v-model="conditions.years"
                  style="width: 200px;"
                  placeholder="请选择年度"></a-select>
      </a-col>
    </a-row>

    <ve-bar-chart :data="chartData" :settings="chartSettings"/>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { orderService, analysisService } from '@/services';
import VueMixins from '@/pages/mixins/vueMixins';

@Component({ name: 'AnalysisIndex' })
export default class AnalysisIndex extends Mixins(VueMixins) {
  conditionsOptions = {
    years: [],
    channel: [],
  };

  conditions = {
    years: undefined,
    channel: undefined,
  };

  chartData = {};

  chartSettings = {
    label: {
      show: true,
      // fontSize: '12',
      fontWeight: 'bold',
      // position: 'inside',
    },
    xAxisLabelShow: true,
    xAxisLineShow: false,
    yAxisLabelShow: true,
    yAxisLineShow: false,
  };

  // 获取筛选条件下拉需要的options
  fetchConditionsOptions() {
    Promise.all([orderService.fetchChannelList(), orderService.fetchYearList()])
        .then(([channelOptions, yearOptions]) => {
          this.conditionsOptions.channel = channelOptions.filter((item) => !!item)
              .map((value) => ({
                title: value,
                value,
              }));

          this.conditionsOptions.years = yearOptions.filter((item) => !!item)
              .map((value) => ({
                title: `${value}年`,
                value,
              }));

          this.conditions.channel = this.conditionsOptions.channel[0].value;
          this.conditions.years = this.conditionsOptions.years[0].value;

          this.$nextTick(() => {
            this.fetchData();
          });
        });
  }

  // 获取分析结果
  fetchData(params = this.conditions) {
    const formatData = (data = []) => {
      const chartData = {
        dimensions: {
          name: '月份',
          data: [],
        },
        measures: [{
          name: '营业额',
          data: [],
        }, {
          name: '订单量',
          data: [],
        }],
      };

      data.forEach(({
                      month,
                      orderNumber,
                      turnover,
                    }) => {
        chartData.dimensions.data.push(month);
        chartData.measures[0].data.push(turnover || 0);
        chartData.measures[1].data.push(orderNumber || 0);
      });

      return chartData;
    };

    analysisService.fetchAnalysisByChannelAndYear(params)
        .then(({ orderTurnovers }) => {
          if (orderTurnovers?.length > 0) {
            this.chartData = formatData(orderTurnovers);
            console.log('条形图data:', this.chartData);
          }
        });
  }

  mounted() {
    this.fetchConditionsOptions();
  }

  @Watch('conditions', {
    deep: true,
  })
  handleConditionsChange(newVal, oldVal) {
    this.fetchData();
  }
}
</script>

<style scoped lang="less">

</style>
