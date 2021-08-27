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
                   :row-selection="{ selectedRowKeys: dispatchOrderList.map(({id})=>id), onChange: onSelectChange  }"
                   :pagination="pagination">
      <div slot="extra" style="display: flex;justify-content: end;">
        <file-upload class="margin-left-xs"
                     @success="uploadSuccess"
                     @upLoading="(isLoading)=>spinning=isLoading">
          <a-button :loading="spinning" :disabled="spinning">
            导入
          </a-button>
        </file-upload>

        <a-button type="primary" style="margin-left: 10px;" @click="onDispatch"
                  :disabled="dispatchOrderList.length<1">
          派单
        </a-button>

        <div slot="extra" style="display: flex;justify-content: end;">
          <a-button type="primary" style="margin-left: 10px;" @click="onAddOrder">
            新增
          </a-button>
        </div>
      </div>

      <template slot="operation" slot-scope="{record}">
        <!--派单-->
        <a @click="onConfirmDispatch([record])">派单</a>

        <!--编辑-->
        <a-divider type="vertical"/>
        <a @click="onUpdateOrder(record)">编辑</a>

        <!--删除-->
        <a-divider type="vertical"/>
        <a-popconfirm title="确定删除" @confirm="onDeleteDispatch(record)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </advance-table>

    <!--订单派发确认modal-->
    <dispatch-orders-confirm-modal ref="dispatchOrdersConfirmModal"
                                   @success="onDispatchOrderListSuccess"></dispatch-orders-confirm-modal>

    <!--文件导入数据成功确认modal-->
    <!--    <import-data-confirm-modal ref="importDataConfirmModal"-->
    <!--                               @confirm="onImportDataConfirm"></import-data-confirm-modal>-->

    <!--订单的编辑及添加modal-->
    <order-form-modal ref="orderFormModal" @submitSuccess="refreshDataSource()"></order-form-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Mixins, Vue, Watch,
} from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { orderService } from '@/services';
import DispatchOrdersConfirmModal from '@/pages/order/dispatchOrdersConfirmModal.vue';
import VueMixins from '@/pages/mixins/vueMixins';
import ImportDataConfirmModal from '@/pages/order/importDataConfirmModal.vue';
import { OrderStatusEnum } from '@/services/order';
import FileUpload from '@/components/file/fileUpload.vue';
import OrderFormModal from '@/pages/order/orderFormModal.vue';

@Component({
  name: 'OrderList',
  components: {
    OrderFormModal,
    FileUpload,
    ImportDataConfirmModal,
    DispatchOrdersConfirmModal,
    AdvanceTable,
  },
})
export default class OrderList extends Mixins(VueMixins) {
  scroll = {
    x: 100,
    y: document.body.clientHeight - 350,
  };

  // selectedRowKeys = [];

  // 所有选中将要被派单的order（各个页面）
  dispatchOrderList = [];

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
      width: 150,
      ellipsis: true,
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
      ellipsis: true,
    },
    {
      title: '下车地点',
      dataIndex: 'destinationAddress',
      width: 200,
      ellipsis: true,
    },
    // {
    //   title: '驾驶员姓名',
    //   dataIndex: 'driverName',
    //   width: 110,
    //   searchAble: true,
    // },
    // {
    //   title: '驾驶员电话',
    //   dataIndex: 'driverPhone',
    //   width: 120,
    // },
    // {
    //   title: '车牌',
    //   dataIndex: 'licenseNumber',
    //   width: 110,
    //   searchAble: true,
    // },
    {
      title: '预定部门',
      dataIndex: 'reservationDepartment',
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 150,
      ellipsis: true,
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
      ellipsis: true,
    },
    {
      title: '乘客电话',
      dataIndex: 'passengerPhone',
      width: 120,
    },
    // {
    // searchAble: true,
    // dataIndex: 'status',
    // dataType: 'select',
    // slots: { title: 'statusTitle' },
    // scopedSlots: { customRender: 'status' },
    // width: 100,
    // search: {
    //   selectOptions: [
    //     {
    //       title: '待派单',
    //       value: OrderStatusEnum.待派单,
    //     },
    //     {
    //       title: '待接单',
    //       value: OrderStatusEnum.待接单,
    //     },
    //     {
    //       title: '进行中',
    //       value: OrderStatusEnum.进行中,
    //     },
    //     {
    //       title: '已结束',
    //       value: OrderStatusEnum.已结束,
    //     },
    //   ],
    // },
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
    },
    {
      title: '车队',
      dataIndex: 'motorcade',
      width: 80,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 280,
      fixed: 'right',
      scopedSlots: { customRender: 'operation' },
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
      this.fetchData();
    },
    onShowSizeChange: (current, size) => {
      this.pagination.current = 1;
      this.pagination.pageSize = size;
      this.fetchData();
    },
  };

  // 导入的文件数据
  importFileData = [];

  // exportOrderByExcel(fileName = '导出数据.xlsx', params = undefined, url = '/calc/getResultFile') {
  //   return new Promise((resolve, reject) => {
  //     ajaxHelperInstance.downloadFile(url, fileName, params)
  //         .then((res) => resolve(true), (error) => reject(false));
  //   });
  // }

  // 选中项发生变化时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    this.dispatchOrderList = selectedRows;
  }

  // onImportDataConfirm(importType) {
  //   let temp_dataSource = [];
  //   switch (importType) {
  //     case 'push':
  //       temp_dataSource = [...new Set([...this.dataSource, ...this.importFileData])];
  //       break;
  //     case 'unshift':
  //       temp_dataSource = [...new Set([...this.importFileData, ...this.dataSource])];
  //       break;
  //     default:
  //       temp_dataSource = [...this.importFileData];
  //       break;
  //   }
  //   debugger;
  //   // 数据导入
  //   orderService.importOrders(temp_dataSource)
  //       .then((importRecordCount) => {
  //         debugger;
  //         importRecordCount = Number(importRecordCount) || 0;
  //         if (importRecordCount === temp_dataSource.length) {
  //           this.$message.success(`成功导入 ${importRecordCount} 条数据！`);
  //         } else {
  //           this.$message.success(`成功导入 ${importRecordCount} 条数据，导入失败${(temp_dataSource.length - importRecordCount)} 条！`);
  //         }
  //         this.refreshDataSource();
  //       });
  // }

  // 用户手动选择/取消选择某列的回调
  // onSelectRow(record, selected, selectedRows) {
  //   this.dispatchOrderList[this.pagination.current] = selectedRows;
  // }

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
          debugger;
          this.dataSource = items || [];
          this.pagination.total = totalCount || 0;
        });
  }

  refreshDataSource() {
    debugger;
    this.dispatchOrderList = [];
    this.pagination.current = 1;
    this.pagination.total = 0;
    this.fetchData();
  }

  // 上传成功
  uploadSuccess(importFileData) {
    this.importFileData = importFileData;
    // this.openModal('importDataConfirmModal');
    const self = this;
    this.$confirm({
      title: '提示',
      content: '是否确定导入新数据？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 数据导入
        orderService.addOrders(importFileData)
            .then((importRecordCount) => {
              debugger;
              importRecordCount = Number(importRecordCount) || 0;
              if (importRecordCount === importFileData.length) {
                self.$message.success(`成功导入 ${importRecordCount} 条数据！`);
              } else {
                self.$message.success(`成功导入 ${importRecordCount} 条数据，导入失败${(importFileData.length - importRecordCount)} 条！`);
              }
              self.refreshDataSource();
            }, (error) => {
              console.error('数据导入错误：', error);
              self.$message.error('数据导入失败！');
            });
      },
    });
  }

  onSearch(conditions, searchOptions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  onRefresh(conditions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  onReset(conditions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  // 派单
  onConfirmDispatch(orders = []) {
    console.log('所有要派的单:', orders);
    this.openModal('dispatchOrdersConfirmModal', { orders });
  }

  // 新增订单信息
  onAddOrder() {
    this.openModal('orderFormModal');
  }

  // 编辑订单信息
  onUpdateOrder(order) {
    this.openModal('orderFormModal', order);
  }

  // 派单信息删除
  onDeleteDispatch({ id }) {
    if (id) {
      orderService.deleteOrder([id])
          .then((res) => {
            this.fetchData();
          });
    }
  }

  // 派单
  onDispatch() {
    console.log('所有要派的单:', this.dispatchOrderList);

    this.openModal('dispatchOrdersConfirmModal', { orders: this.dispatchOrderList });
  }

  // 派单成功
  onDispatchOrderListSuccess(dispatchOrderIds = []) {
    // this.dataSource = this.dataSource.filter(({ id }) => !dispatchOrderIds.includes(id));
    this.refreshDataSource();
  }

  created() {
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
