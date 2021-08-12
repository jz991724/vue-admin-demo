/**
* @描述: 派单
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
                   :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,onSelect:onSelectRow }"
                   :pagination="pagination">
      <div slot="extra" style="display: flex;justify-content: end;">
        <file-upload class="margin-left-xs"
                     @success="uploadSuccess"
                     @upLoading="(isLoading)=>spinning=isLoading">
          <a-button :loading="spinning" :disabled="spinning">
            浏览
          </a-button>
        </file-upload>

        <a-button type="primary" style="margin-left: 10px;" @click="onDispatch">派发</a-button>
      </div>

    </advance-table>

    <!--订单派发确认modal-->
    <dispatch-orders-confirm-modal ref="dispatchOrdersConfirmModal"></dispatch-orders-confirm-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { orderService } from '@/services';
import FileUpload from '@/components/file/fileUpload.vue';
import DispatchOrdersConfirmModal from '@/pages/order/dispatchOrdersConfirmModal.vue';
import VueMixins from '@/pages/mixins/vueMixins';

// order状态enum
export enum OrderStatusEnum {

}

@Component({
  name: 'OrderList',
  components: {
    DispatchOrdersConfirmModal,
    FileUpload,
    AdvanceTable,
  },
})
export default class OrderList extends Mixins(VueMixins) {
  OrderStatusEnum = OrderStatusEnum;

  scroll = {
    x: 600,
    y: document.body.clientHeight - 350,
  };

  selectedRowKeys = [];

  // 所有选中将要被派单的order（各个页面）
  dispatchOrderList = {};

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
    //   searchAble: true,
    //   dataIndex: 'status',
    //   dataType: 'select',
    //   slots: { title: 'statusTitle' },
    //   scopedSlots: { customRender: 'status' },
    //   search: {
    //     selectOptions: [
    //       {
    //         title: '已下单',
    //         value: 1,
    //       },
    //       {
    //         title: '已付款',
    //         value: 2,
    //       },
    //       {
    //         title: '已审核',
    //         value: 3,
    //       },
    //       {
    //         title: '已发货',
    //         value: 4,
    //       },
    //     ],
    //   },
    // },
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

  // exportOrderByExcel(fileName = '导出数据.xlsx', params = undefined, url = '/calc/getResultFile') {
  //   return new Promise((resolve, reject) => {
  //     ajaxHelperInstance.downloadFile(url, fileName, params)
  //         .then((res) => resolve(true), (error) => reject(false));
  //   });
  // }

  // 选中项发生变化时的回调
  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }

  // 用户手动选择/取消选择某列的回调
  onSelectRow(record, selected, selectedRows) {
    this.dispatchOrderList[this.pagination.current] = selectedRows;
  }

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
    debugger;
    orderService.fetchOrderList(params, this.conditions)
        .then(({
                 items,
                 totalCount,
               }) => {
          debugger;
          this.dataSource = items || [];
          this.pagination.total = totalCount || 0;
        });
  }

  // 上传成功
  uploadSuccess([{
    tempFilePath,
    ...allSheets
  }]) {
    debugger;
    // this.calcFilePath = tempFilePath;
    // this.importData = allSheets;
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

  // 派单
  onDispatch() {
    let allDispatchOrderList = [];
    Object.values(this.dispatchOrderList)
        .forEach((orders: any = []) => {
          allDispatchOrderList = [...allDispatchOrderList, ...orders];
        });
    console.log('所有要派的单:', allDispatchOrderList);

    this.openModal('dispatchOrdersConfirmModal', allDispatchOrderList);
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
