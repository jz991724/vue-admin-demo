/**
* @描述: 订单列表
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <div class="table">
    <advance-table :columns="columns"
                   :data-source="dataSource"
                   title="订单列表"
                   :loading="spinning"
                   rowKey="id"
                   @search="onSearch"
                   @refresh="onRefresh"
                   :format-conditions="true"
                   @reset="onReset"
                   :scroll="scroll"
                   :pagination="pagination">
      <template slot="statusTitle">
        状态
        <a-icon style="margin: 0 4px" type="info-circle"/>
      </template>
      <!--      <template slot="send" slot-scope="{text}">-->
      <!--        {{ text ? '是' : '否' }}-->
      <!--      </template>-->
      <template slot="status" slot-scope="{text}">
        <a-tag :color="tagColors[text]">{{ OrderStatusEnum[text].toString() }}</a-tag>
      </template>
    </advance-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { orderService } from '@/services';

// order状态enum
export enum OrderStatusEnum {
  待派单,
  待接单,
  进行中,
  已结束
}

@Component({
  name: 'OrderList',
  components: { AdvanceTable },
})
export default class OrderList extends Vue {
  OrderStatusEnum = OrderStatusEnum;

  tagColors = {
    [OrderStatusEnum.待派单]: 'purple',
    [OrderStatusEnum.待接单]: 'cyan',
    [OrderStatusEnum.进行中]: 'orange',
    [OrderStatusEnum.已结束]: '',
  };

  scroll = {
    x: 100,
    y: document.body.clientHeight - 350,
  };

  spinning = false;

  columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 100,
    },
    {
      title: '渠道',
      width: 100,
      dataIndex: 'channel',
    },
    {
      title: '乘客姓名',
      dataIndex: 'passengerName',
      width: 100,
    },
    {
      title: '用车日期',
      dataIndex: 'useCarDate',
      width: 100,
      dataType: 'date',
    },
    {
      title: '航班时间',
      dataIndex: 'flightTime',
      width: 100,
      dataType: 'time',
    },
    {
      title: '用车时间',
      dataIndex: 'useCarTime',
      width: 100,
      dataType: 'time',
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      width: 100,
    },
    {
      title: '航班车次号',
      dataIndex: 'flightNumber',
      width: 120,
    },
    {
      title: '上车地点',
      dataIndex: 'startAddress',
      width: 200,
    },
    {
      title: '下车地点',
      dataIndex: 'destinationAddress',
      width: 200,
    },

    {
      title: '驾驶员姓名',
      dataIndex: 'driverName',
      width: 110,
      searchAble: true,
    },
    {
      title: '驾驶员电话',
      dataIndex: 'driverPhone',
      width: 120,
    },
    {
      title: '车牌',
      dataIndex: 'licenseNumber',
      width: 110,
      searchAble: true,
    },
    {
      title: '预定部门',
      dataIndex: 'reservationDepartment',
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '车型',
      dataIndex: 'carType',
      width: 80,
    },
    {
      title: '采购应付金',
      dataIndex: 'amountPayable',
      width: 110,
    },
    {
      title: '预订人',
      dataIndex: 'reservationPeople',
      width: 120,
    },
    {
      title: '乘客电话',
      dataIndex: 'passengerPhone',
      width: 120,
    },
    {
      searchAble: true,
      dataIndex: 'status',
      dataType: 'select',
      slots: { title: 'statusTitle' },
      scopedSlots: { customRender: 'status' },
      width: 100,
      search: {
        selectOptions: [
          {
            title: '待派单',
            value: OrderStatusEnum.待派单,
          },
          {
            title: '待接单',
            value: OrderStatusEnum.待接单,
          },
          {
            title: '进行中',
            value: OrderStatusEnum.进行中,
          },
          {
            title: '已结束',
            value: OrderStatusEnum.已结束,
          },
        ],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
    {
      title: '车队',
      dataIndex: 'motorcade',
      width: 80,
    },

    // {
    //   title: '发货',
    //   searchAble: true,
    //   dataIndex: 'send',
    //   dataType: 'boolean',
    //   scopedSlots: { customRender: 'send' },
    //   search: {
    //     switchOptions: {
    //       checkedText: '开',
    //       uncheckedText: '关',
    //     },
    //   },
    // },
  ];

  dataSource = [];

  conditions = {};

  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showLessItems: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
    onChange: (page, pageSize) => {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      // this.getGoodList();
      this.fetchData();
    },
    onShowSizeChange: (current, size) => {
      this.pagination.current = 1;
      this.pagination.pageSize = size;
      // this.getGoodList();
      this.fetchData();
    },
  };

  fetchData() {
    const {
      pagination: {
        current,
        pageSize,
      },
    } = this;
    const params = {
      index: current || 1,
      size: pageSize || 10,
      isAsc: true,
      orderField: undefined,
    };
    this.dataSource = [];
    orderService.fetchOrderList(params, this.conditions)
        .then(({
                 items,
                 totalCount,
               }) => {
          this.dataSource = items || [];
          this.pagination.total = totalCount || 0;
          console.log('orderList数据：', this.dataSource);
        });
  }

  onSearch(conditions, searchOptions) {
    console.log(searchOptions);
    this.pagination.current = 1;
    this.conditions = conditions;
    // this.getGoodList();
    this.fetchData();
  }

  onRefresh(conditions) {
    this.conditions = conditions;
    // this.getGoodList();
    this.fetchData();
  }

  onReset(conditions) {
    this.conditions = conditions;
    // this.getGoodList();
    this.fetchData();
  }

  created() {
    // this.getGoodList();
    // this.getColumns();
    debugger;
    this.fetchData();
  }
}
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
